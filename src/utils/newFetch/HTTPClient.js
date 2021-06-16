import AbortController from 'abort-controller';
import config from '../../../config';

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

  onNext;

  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  optionsToSearchParams = (options) => {
    if (typeof options !== 'object') {
      throw APIFetchError('Invalid options provided for HttpClient optionsToSearchParams method');
    }

    const params = new URLSearchParams();
    Object.keys(options).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const value = options[key];
        params.set(key, value);
      }
    });

    return params.toString();
  }

  fetchNext = async (query, results) => {
    const signal = this.abortController?.signal || null;
    // Clear old timeout
    this.clearTimeout();
    // Create new timeout for next fetch
    this.createTimeout();

    return fetch(query, { signal })
      .then(response => response.json())
      .then(async (response) => {
        const combinedResults = [...results, ...response.results];
        if (this.onNext) {
          this.onNext(combinedResults.length, response.count);
        }
        if (response.next) {
          return this.fetchNext(response.next, combinedResults);
        }
        return combinedResults;
      });
  }

  handleResults = async (response) => {
    if (response.next) {
      if (this.onNext) {
        this.onNext(response.results.length, response.count);
      }
      return this.fetchNext(response.next, response.results);
    }
    return response.results;
  }

  fetch = async (endpoint, options) => {
    this.abortController = new AbortController();
    this.status = 'fetching';

    const signal = this.abortController?.signal || null;

    // Since we do not send any POST data to server we expect all fetches to be GET
    // and utilize search parameters for sending required data
    if (typeof options !== 'string') {
      this.throwAPIError('Invalid options given to HTTPClient\'s fetch method');
    }
    // Create fetch promise
    const promise = fetch(`${this.baseURL}/${endpoint}?${options}`, { signal });

    // Create timeout for aborting fetch
    this.createTimeout();

    // Preform fetch
    return promise
      .then(response => response.json())
      .then(async (data) => {
        const results = await this.handleResults(data);
        this.clearTimeout();
        this.status = 'done';
        return results;
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          this.throwAPIError(`Error ${endpoint} fetch aborted`, e);
        } else {
          this.throwAPIError(`Error while fetching ${endpoint}:`, e);
        }
      });
  }

  get = async (endpoint, options) => this.fetch(endpoint, this.optionsToSearchParams(options));

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
      throw new APIFetchError('Invalid AbortController when attempting to abort fetch');
    }
    this.clearTimeout();
    this.abortController.abort();
  }

  createTimeout = () => {
    this.timeout = setTimeout(() => {
      this.abort();
    }, this.timeoutTimer);
  }

  clearTimeout = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  setOnNext = (onNext) => {
    if (typeof onNext !== 'function') {
      throw new APIFetchError('Invalid onNext provided for HTTPClient');
    }
    this.onNext = onNext;
  }

  setOnError = (onError) => {
    if (typeof onError !== 'function') {
      throw new APIFetchError('Invalid onError provided for HTTPClient');
    }
    this.onError = onError;
  }

  isFetching = () => this.status === 'fetching';
}
