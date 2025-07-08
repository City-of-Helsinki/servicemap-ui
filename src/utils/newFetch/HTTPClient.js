import config from '../../../config';

export const hearingMapAPIName = 'hearingmap';
export const serviceMapAPIName = 'servicemap';
export const LinkedEventsAPIName = 'linkedEvens';

export class APIFetchError extends Error {
  constructor(props) {
    super(props);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIFetchError);
    }

    this.name = 'APIFetchError';
    // Custom debugging information
    this.date = new Date();
  }
}

export default class HttpClient {
  timeoutTimer = config?.searchTimeout || 10000;

  status = '';

  abortController;

  timeout;

  onError;

  onProgressUpdate;

  constructor(baseURL, apiName) {
    this.baseURL = baseURL;
    this.apiName = apiName;
  }

  optionsToSearchParams = (options) => {
    if (typeof options !== 'object') {
      throw APIFetchError(
        'Invalid options provided for HttpClient optionsToSearchParams method'
      );
    }

    const params = new URLSearchParams();
    Object.keys(options).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const value = options[key];
        if (value || value === false) {
          params.set(key, value);
        }
      }
    });

    return params.toString();
  };

  fetchNext = async (query, results) => {
    const signal = this.abortController?.signal || null;
    // Clear old timeout
    this.clearTimeout();
    // Create new timeout for next fetch
    this.createTimeout();

    return fetch(query, { signal })
      .then((response) => response.json())
      .then(async (response) => {
        const combinedResults = [...results, ...response.results];
        if (this.onProgressUpdate) {
          this.onProgressUpdate(combinedResults.length, response.count);
        }
        if (response.next) {
          return this.fetchNext(response.next, combinedResults);
        }
        return combinedResults;
      });
  };

  handleServiceMapResults = async (response, type) => {
    if (type && type === 'post') {
      if (response.status >= 200 && response.status <= 299) {
        return response.statusText;
      }
      return false;
    }
    if (type && type === 'count') {
      return response.count;
    }
    if (this.onProgressUpdate) {
      this.onProgressUpdate(response.results.length, response.count);
    }
    if (type && type === 'single') {
      return response.results;
    }
    if (response.next) {
      return this.fetchNext(response.next, response.results);
    }
    return response.results;
  };

  handleLinkedEventsResults = async (response, type) => {
    if (type && type === 'count') {
      return response.meta.count;
    }
    if (this.onProgressUpdate) {
      this.onProgressUpdate(response.data.length, response.meta.count);
    }
    if (type && type === 'single') {
      return response.data;
    }
    if (response.next) {
      return this.fetchNext(response.meta.next, response.data);
    }

    return response.data;
  };

  handleResults = async (response, type) => {
    if (this.apiName === serviceMapAPIName) {
      return this.handleServiceMapResults(response, type);
    }
    if (this.apiName === LinkedEventsAPIName) {
      return this.handleLinkedEventsResults(response, type);
    }

    // Default to given response
    return response;
  };

  handleFetch = async (endpoint, url, options = {}, type) => {
    if (!this.abortController) {
      this.abortController = new AbortController();
    }
    this.status = 'fetching';

    const signal = this.abortController?.signal || null;

    // Since we do not send any POST data to server we expect all fetches to be GET
    // and utilize search parameters for sending required data
    if (typeof options !== 'object') {
      this.throwAPIError(
        "Invalid options given to HTTPClient's handleFetch method"
      );
    }
    // Create fetch promise
    const promise = fetch(`${url}`, { ...options, signal });

    // Create timeout for aborting fetch
    if (!this.timeout) {
      this.createTimeout();
    }

    // Preform fetch
    return promise
      .then((response) => {
        if (type === 'post') return response;
        return response.json();
      })
      .then(async (data) => {
        const results = await this.handleResults(data, type);
        this.clearTimeout();
        this.status = 'done';
        return results;
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          this.throwAPIError(`Error ${endpoint} fetch aborted`, e);
        } else {
          this.throwAPIError(
            `Error while fetching ${endpoint}: ${e.message}`,
            e
          );
        }
      });
  };

  // Create a POST fetch request to given endpoint with given data.
  // Base url may be overridden since this was needed for sending stats
  postFetch = async (endpoint, data, overrideBaseUrl = false) => {
    if (typeof data !== 'object') {
      this.throwAPIError("Invalid data given to HTTPClient's fetchPost method");
    }

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(data).toString(),
    };
    return this.handleFetch(
      endpoint,
      `${overrideBaseUrl || this.baseURL}/${endpoint}`,
      postOptions,
      'post'
    );
  };

  // Fetch with GET
  fetch = async (endpoint, searchParams, type) => {
    // Since we do not send any POST data to server we expect all fetches to be GET
    // and utilize search parameters for sending required data
    if (typeof searchParams !== 'string') {
      this.throwAPIError(
        "Invalid searchParams given to HTTPClient's fetch method"
      );
    }

    const fetchOptions = {};
    // this will prevent http 301 responses for "...unit?page=..." and immediate retries
    // with "...unit/?page=..."
    const appendSlash = endpoint.lastIndexOf('/') !== endpoint.length - 1;

    const url = `${this.baseURL}/${endpoint}${appendSlash ? '/' : ''}?${searchParams}`;
    return this.handleFetch(endpoint, url, fetchOptions, type);
  };

  post = async (endpoint, data, overrideBaseUrl) =>
    this.postFetch(endpoint, data, overrideBaseUrl);

  get = async (endpoint, options) =>
    this.fetch(endpoint, this.optionsToSearchParams(options));

  getSinglePage = (endpoint, options) =>
    this.fetch(endpoint, this.optionsToSearchParams(options), 'single');

  // This fetches 1 result to get meta data with total result count
  getCount = async (endpoint, options) => {
    const newOptions = {
      ...options,
      page_size: 1,
      only: 'id',
      include: null,
      geometry: false,
    };
    return this.fetch(
      endpoint,
      this.optionsToSearchParams(newOptions, true),
      'count'
    );
  };

  getConcurrent = async (endpoint, options) => {
    if (!options?.page_size) {
      throw APIFetchError(
        'Invalid page_size provided for concurrent search method'
      );
    }

    // Get amount of search pages
    const totalCount = await this.getCount(endpoint, options);
    const numberOfPages = Math.ceil(totalCount / options.page_size);

    // Start progress bar
    if (this.onProgressUpdate) {
      this.onProgressUpdate(null, totalCount);
    }

    // Create promises for each search page
    const promises = [];
    for (let i = 1; i <= numberOfPages; i += 1) {
      options.page = i;
      const promise = this.getSinglePage(endpoint, options);
      promises.push(
        promise.then((results) => {
          this.clearTimeout();
          return results;
        })
      );
    }

    const results = await Promise.all(promises);
    return results.flat();
  };

  throwAPIError = (msg, e) => {
    this.status = 'error';
    this.clearTimeout();
    if (this.onError) {
      this.onError(e);
    }
    throw new APIFetchError(msg, e);
  };

  getStatus = () => this.status;

  abort = () => {
    if (!this.abortController?.abort) {
      throw new APIFetchError(
        'Invalid AbortController when attempting to abort fetch'
      );
    }
    this.clearTimeout();
    this.abortController.abort();
  };

  createTimeout = () => {
    this.timeout = setTimeout(() => {
      this.abort();
    }, this.timeoutTimer);
  };

  clearTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  setOnProgressUpdate = (onProgressUpdate) => {
    if (typeof onProgressUpdate !== 'function') {
      throw new APIFetchError(
        'Invalid onProgressUpdate provided for HTTPClient'
      );
    }
    this.onProgressUpdate = onProgressUpdate;
  };

  setOnError = (onError) => {
    if (typeof onError !== 'function') {
      throw new APIFetchError('Invalid onError provided for HTTPClient');
    }
    this.onError = onError;
  };

  setAbortController = (controller) => {
    if (typeof controller !== 'object') {
      throw new APIFetchError(
        'Invalid abort controller provided for HTTPClient'
      );
    }
    this.abortController = controller;
  };

  isFetching = () => this.status === 'fetching';
}
