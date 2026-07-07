import config from '../../../config';

export const hearingMapAPIName = 'hearingmap';
export const serviceMapAPIName = 'servicemap';
export const LinkedEventsAPIName = 'linkedEvens';

export class APIFetchError extends Error {
  constructor(message, cause) {
    super(message);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIFetchError);
    }

    this.name = 'APIFetchError';
    // Custom debugging information
    this.date = new Date();
    // Preserve the original error so callers can distinguish abort from other failures
    this.cause = cause || null;
  }
}

// Distinct subclass for fetches that were aborted (user navigated away,
// iOS backgrounded the tab, explicit abort(), or the 10s timeout fired).
// Call sites can filter these with `instanceof AbortAPIError`, and Sentry
// drops them via `ignoreErrors` so they don't pollute error reporting.
export class AbortAPIError extends APIFetchError {
  constructor(message, cause) {
    super(message, cause);
    this.name = 'AbortAPIError';
  }
}

export default class HttpClient {
  timeoutTimer = config?.searchTimeout || 10000;

  status = '';

  abortController;

  onError;

  onProgressUpdate;

  constructor(baseURL, apiName) {
    this.baseURL = baseURL;
    this.apiName = apiName;
  }

  optionsToSearchParams = (options) => {
    if (typeof options !== 'object') {
      throw new APIFetchError(
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
    // Use an externally provided AbortController when present (e.g. SearchBar
    // suggestions), otherwise create a per-request one so each paginated fetch
    // owns its timeout and can't be aborted by a sibling request finishing.
    const abortController = this.abortController || new AbortController();
    const { signal } = abortController;
    const timeoutId = setTimeout(
      () => abortController.abort(),
      this.timeoutTimer
    );

    try {
      const response = await fetch(query, { signal });
      const json = await response.json();
      const combinedResults = [...results, ...json.results];
      if (this.onProgressUpdate) {
        this.onProgressUpdate(combinedResults.length, json.count);
      }
      if (json.next) {
        return await this.fetchNext(json.next, combinedResults);
      }
      return combinedResults;
    } catch (e) {
      // Let already-classified errors bubble to handleFetch untouched.
      if (e instanceof APIFetchError) {
        throw e;
      }
      // iOS/Safari throws TypeError("Load failed") instead of AbortError when a
      // fetch is cancelled, so trust signal.aborted as the source of truth.
      if (e.name === 'AbortError' || signal.aborted) {
        throw new AbortAPIError(`Error ${query} fetch aborted`, e);
      }
      throw e;
    } finally {
      clearTimeout(timeoutId);
    }
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
      return { count: response.count, data: response.results };
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
      return { count: response.meta.count, data: response.data };
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
    this.status = 'fetching';

    // Since we do not send any POST data to server we expect all fetches to be GET
    // and utilize search parameters for sending required data
    if (typeof options !== 'object') {
      this.throwAPIError(
        "Invalid options given to HTTPClient's handleFetch method"
      );
    }

    // Use an externally provided AbortController when present (e.g. SearchBar
    // suggestions), otherwise create a per-request one with its own timeout so
    // concurrent requests don't share an abort signal or cancel one another.
    const abortController = this.abortController || new AbortController();
    const { signal } = abortController;
    const timeoutId = setTimeout(
      () => abortController.abort(),
      this.timeoutTimer
    );

    try {
      const response = await fetch(`${url}`, { ...options, signal });

      let data;
      if (type === 'post') {
        data = response;
      } else {
        // Surface HTTP errors with a clean message instead of letting
        // response.json() produce a misleading SyntaxError on error pages.
        if (!response.ok) {
          throw new APIFetchError(
            `Error while fetching ${endpoint}: HTTP ${response.status} ${response.statusText}`
          );
        }
        data = await response.json();
      }

      const results = await this.handleResults(data, type);
      this.status = 'done';
      return results;
    } catch (e) {
      // Already classified upstream (e.g. non-ok response, fetchNext abort) —
      // don't rewrap.
      if (e instanceof APIFetchError) {
        this.status = 'error';
        if (this.onError) this.onError(e);
        throw e;
      }

      // iOS/Safari throws TypeError("Load failed") instead of DOMException("AbortError")
      // when a fetch is cancelled via AbortSignal. Check signal.aborted as the
      // authoritative source of truth so both browsers are handled uniformly.
      if (e.name === 'AbortError' || signal?.aborted) {
        this.throwAPIError(`Error ${endpoint} fetch aborted`, e, AbortAPIError);
      } else {
        this.throwAPIError(`Error while fetching ${endpoint}: ${e.message}`, e);
      }

      // throwAPIError always throws; this satisfies consistent-return.
      return undefined;
    } finally {
      clearTimeout(timeoutId);
    }
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

  getConcurrent = async (endpoint, options, concurrencyLimit = 30) => {
    if (!options?.page_size) {
      throw new APIFetchError(
        'Invalid page_size provided for concurrent search method'
      );
    }

    // Fetch first page to get its data and also total count
    const firstPage = await this.getSinglePage(endpoint, {
      ...options,
      page: 1,
    });
    const totalCount = firstPage?.count ?? 0;
    const numberOfPages = Math.ceil(totalCount / options.page_size);

    if (totalCount === 0) {
      return [];
    }

    // Start progress with first page data and total count
    if (this.onProgressUpdate) {
      this.onProgressUpdate(firstPage.data.length, totalCount);
    }

    // Fetch remaining pages (2..N) in batches so we don't open hundreds of
    // simultaneous connections, which the API can reject under load.
    const results = [...firstPage.data];
    for (
      let batchStart = 2;
      batchStart <= numberOfPages;
      batchStart += concurrencyLimit
    ) {
      const batchEnd = Math.min(
        batchStart + concurrencyLimit - 1,
        numberOfPages
      );
      const batchPromises = [];
      for (let page = batchStart; page <= batchEnd; page += 1) {
        batchPromises.push(
          this.getSinglePage(endpoint, { ...options, page }).then(
            (res) => res?.data ?? []
          )
        );
      }
      // Batches run sequentially on purpose to cap concurrent requests.

      const batchData = await Promise.all(batchPromises);
      results.push(...batchData.flat());
      if (this.onProgressUpdate) {
        this.onProgressUpdate(results.length, totalCount);
      }
    }

    return results;
  };

  throwAPIError = (msg, e, ErrorClass = APIFetchError) => {
    this.status = 'error';
    if (this.onError) {
      this.onError(e);
    }
    throw new ErrorClass(msg, e);
  };

  getStatus = () => this.status;

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
