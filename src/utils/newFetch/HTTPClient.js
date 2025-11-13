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

  onError;

  onProgressUpdate;

  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  optionsToSearchParams = (options) => {
    if (typeof options !== 'object') {
      this.throwAPIError(
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

  fetchNext = async (query, results, depth = 0) => {
    // Prevent infinite recursion
    if (depth > 100) {
      this.throwAPIError('Maximum pagination depth exceeded (100 pages)');
    }

    // Use external abort controller if provided, otherwise create per-request controller
    const abortController = this.abortController || new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, this.timeoutTimer);

    try {
      const response = await fetch(query, { signal: abortController.signal });
      clearTimeout(timeoutId);

      let jsonResponse;
      try {
        jsonResponse = await response.json();
      } catch (parseError) {
        this.throwAPIError(
          `Failed to parse JSON response: ${parseError.message}`
        );
      }

      const combinedResults = [...results, ...jsonResponse.results];
      if (this.onProgressUpdate) {
        this.onProgressUpdate(combinedResults?.length, jsonResponse.count);
      }

      if (jsonResponse.next) {
        return this.fetchNext(jsonResponse.next, combinedResults, depth + 1);
      }
      return combinedResults;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        this.throwAPIError(
          `Pagination request timed out after ${this.timeoutTimer}ms`
        );
      }
      throw error;
    }
  };

  // Generic result handler - can be overridden by subclasses
  handleResults = async (response, type) => {
    return response;
  };

  handleFetch = async (endpoint, url, options = {}, type) => {
    // Validate options
    if (typeof options !== 'object' || options === null) {
      this.throwAPIError(
        "Invalid options given to HTTPClient's handleFetch method"
      );
    }

    // Use external abort controller if provided, otherwise create per-request controller
    const abortController = this.abortController || new AbortController();
    this.status = 'fetching';

    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, this.timeoutTimer);

    try {
      // Perform fetch with abort signal
      const response = await fetch(url, {
        ...options,
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      let data;
      if (type === 'post') {
        data = response;
      } else {
        try {
          data = await response.json();
        } catch (parseError) {
          this.throwAPIError(
            `Failed to parse JSON response from ${endpoint}: ${parseError.message}`
          );
        }
      }

      const results = await this.handleResults(data, type);
      this.status = 'done';
      return results;
    } catch (error) {
      clearTimeout(timeoutId);
      this.status = 'error';

      if (this.onError) {
        this.onError(error);
      }

      if (error.name === 'AbortError') {
        throw new APIFetchError(
          `Request to ${endpoint} timed out after ${this.timeoutTimer}ms`
        );
      } else {
        throw new APIFetchError(
          `Error while fetching ${endpoint}: ${error.message}`,
          error
        );
      }
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
      this.throwAPIError(
        'Invalid page_size provided for concurrent search method'
      );
    }

    // Get amount of search pages
    const totalCount = await this.getCount(endpoint, options);

    // Handle empty results case early
    if (totalCount === 0) {
      if (this.onProgressUpdate) {
        this.onProgressUpdate(0, 0);
      }
      return [];
    }

    const numberOfPages = Math.ceil(totalCount / options.page_size);

    // Start progress bar
    if (this.onProgressUpdate) {
      this.onProgressUpdate(null, totalCount);
    }

    // Prevent excessive concurrent requests - increased limit for batched processing
    if (numberOfPages > 200) {
      this.throwAPIError(
        `Too many pages requested (${numberOfPages}). Consider increasing page_size or using pagination.`
      );
    }

    // Process pages in batches to limit concurrent requests
    const BATCH_SIZE = concurrencyLimit;
    const successfulResults = [];
    const failedPages = [];

    for (
      let batchStart = 1;
      batchStart <= numberOfPages;
      batchStart += BATCH_SIZE
    ) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, numberOfPages);
      const batchPromises = [];

      // Create batch of promises
      for (let pageNum = batchStart; pageNum <= batchEnd; pageNum += 1) {
        const pageOptions = { ...options, page: pageNum };

        const pagePromise = this.getSinglePage(endpoint, pageOptions)
          .then((result) => {
            if (result) {
              successfulResults.push(...result);
            }
            // Update progress as individual paZges complete
            if (this.onProgressUpdate) {
              this.onProgressUpdate(successfulResults?.length, totalCount);
            }
            return { status: 'fulfilled', value: result, page: pageNum };
          })
          .catch((error) => {
            failedPages.push(pageNum);
            console.warn(`Page ${pageNum} failed:`, error.message);
            return { status: 'rejected', reason: error, page: pageNum };
          });

        batchPromises.push(pagePromise);
      }

      // Wait for current batch to complete before starting next batch
      await Promise.allSettled(batchPromises);
    }

    // If some pages failed but we got some results, log warning but continue
    if (failedPages.length > 0 && successfulResults.length > 0) {
      console.warn(
        `${failedPages.length} out of ${numberOfPages} pages failed. ` +
          `Returning ${successfulResults.length} results from successful pages.`
      );
    }

    // If all pages failed, throw error
    if (successfulResults.length === 0) {
      this.throwAPIError(`All ${numberOfPages} pages failed to load`);
    }

    return successfulResults;
  };

  // Sequential processing method for performance comparison
  throwAPIError = (msg, originalError) => {
    this.status = 'error';
    if (this.onError) {
      this.onError(originalError);
    }
    throw new APIFetchError(msg, originalError);
  };

  getStatus = () => this.status;

  setOnProgressUpdate = (onProgressUpdate) => {
    if (typeof onProgressUpdate !== 'function') {
      this.throwAPIError('Invalid onProgressUpdate provided for HTTPClient');
    }
    this.onProgressUpdate = onProgressUpdate;
  };

  setOnError = (onError) => {
    if (typeof onError !== 'function') {
      this.throwAPIError('Invalid onError provided for HTTPClient');
    }
    this.onError = onError;
  };

  setAbortController = (controller) => {
    if (typeof controller !== 'object') {
      this.throwAPIError('Invalid abort controller provided for HTTPClient');
    }
    this.abortController = controller;
  };

  isFetching = () => this.status === 'fetching';
}
