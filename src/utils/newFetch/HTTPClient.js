import AbortController from 'abort-controller';
import config from '../../../config';

export class APIFetchError extends Error {
  constructor(props) {
    super(props);
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIFetchError)
    }

    this.name = 'APIFetchError'
    // Custom debugging information
    this.date = new Date()
  }
}

export default class HttpClient {
  timeoutTimer = config?.searchTimeout || 10000;
  status = '';
  abortController;
  timeout;

  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  optionsToSearchParams = (options) => {
    if (typeof options !== 'object') {
      throw APIFetchError('Invalid options provided for HttpClient optionsToSearchParams method');
    }

    const params = new URLSearchParams();
    Object.keys(options).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        const value = options[key];
        params.set(key, value);
      }
    });

    return params.toString();
  }

  fetchNext = async (query, results) => {
    const signal = this.abortController?.signal || null;
    console.log('Fetching next:', query)
    return await fetch(query, { signal })
      .then(response => response.json())
      .then(async data => {
        if (data.next) {
          return await this.fetchNext(data.next, [...results, data.results]);
        }
        return [...results, ...data.results];
      });
  }

  handleResults = async (data) => {
    console.log('Status in handleResults', this.status);
    if (data.next) {
      return await this.fetchNext(data.next, [...data.results]);
    }
    return data.results;
  }

  fetch = async (endpoint, options) => {
    this.abortController = new AbortController();
    this.status = 'fetching';

    const signal = this.abortController?.signal || null;
    let promise;

    console.log('Fetching...', `${this.baseURL}/${endpoint}`);

    // Since we do not send any POST data to server we expect all fetches to be GET
    // and utilize search parameters for sending required data
    if (typeof options !== 'string') {
      this.throwAPIError(`Invalid options given to HTTPClient fetch method`);
    }
    // Create fetch promise
    promise = fetch(`${this.baseURL}/${endpoint}?${options}`, { signal });

    // Create timeout for aborting fetch
    this.createTimeout();

    // Preform fetch
    return await promise
      .then(response => response.json())
      .then(async (data) => {
        const results = await this.handleResults(data)
        this.clearTimeout();
        this.status = 'done';
        console.log('Status before returning results', this.status);
        return results;
      })
      .catch(e => {
        if (e.name === 'AbortError') {
          this.throwAPIError(`Error - ${endpoint} fetch aborted: Timeout after ${this.timeoutTimer / 1000} seconds`, e)
        } else {
          this.throwAPIError(`Error while fetching ${endpoint}:`, e)
        }
      });
  }

  get = async (endpoint, options) => {
    console.log('Fetch is using GET');
    return await this.fetch(endpoint, this.optionsToSearchParams(options))
  }

  throwAPIError = (msg, e) => {
    this.status = 'error';
    this.clearTimeout();
    throw new APIFetchError(msg, e);
  };

  getStatus = () => {
    return this.status;
  }
  
  abort = () => {
    if (!this.abortController?.abort) {
      throw new APIFetchError(`Invalid AbortController when attempting to abort fetch`);
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
}
