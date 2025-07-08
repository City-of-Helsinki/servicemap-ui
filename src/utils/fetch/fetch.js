import { APIHandlers } from './constants';

// *****************
// MIDDLEWARES
// *****************

const responseToJson = (response) => response.json();

/**
 * Middleware to handle fetch status check and json transform
 * @param {*} res
 */
const fetchHandler = (res) => {
  if (res.status !== 200) {
    throw new Error(
      `Looks like there was a problem. Status Code: ${res.status}`
    );
  }
  return responseToJson(res);
};

const handleNext = async (allData, response, onNext, fetchOptions) => {
  // Event fetch next handling
  if (response && response.meta && response.meta.next) {
    if (onNext) {
      onNext(allData, response);
    }
    const newResponse = await fetch(response.meta.next, fetchOptions)
      .then(responseToJson)
      .catch((e) => {
        throw new Error(`Error in fetch next: ${e.message}`);
      });

    const totalData = [...allData, ...newResponse.data];
    const data = await handleNext(totalData, newResponse, onNext, fetchOptions);
    return data;
  }

  if (response && response.next) {
    if (onNext) {
      onNext(allData, response);
    }
    const newResponse = await fetch(response.next, fetchOptions)
      .then(responseToJson)
      .catch((e) => {
        throw new Error(`Error in fetch next: ${e.message}`);
      });

    const totalData = [...allData, ...newResponse.results];
    const data = await handleNext(totalData, newResponse, onNext, fetchOptions);
    return data;
  }

  if (onNext) {
    onNext(allData, response);
  }
  return allData;
};

/**
 * Middleware to handle next fetching
 */
const nextHandler = async (data, onNext, fetchOptions) => {
  // Event fetch next handling
  if (data && data.meta && data.data) {
    const newData = await handleNext(data.data, data, onNext, fetchOptions);
    return newData;
  }
  if (data && data.next && data.results) {
    const newData = await handleNext(data.results, data, onNext, fetchOptions);
    return newData;
  }
  if (onNext) {
    onNext(data.results, data);
  }
  return data.results;
};

// *****************
// FETCH FUNCTIONALITY
// *****************

/**
 * Transform options object to URI string
 * @param {*} options
 */
const optionsToURLParam = (options = null) => {
  if (!options) {
    return '';
  }

  let urlParam = '';
  Object.keys(options).forEach((key, index) => {
    urlParam += index !== 0 ? '&' : '';
    urlParam += `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
  });

  return urlParam;
};

/**
 * Handle fetch by creating url, adding middlewares and adding callbacks
 * @param {string} url
 * @param {object} options
 * @param {function} onSuccess
 * @param {function} onError
 * @param {function} onNext
 * @param {string} handlerKey
 * @param {AbortController} abortController
 */
const handleFetch = async (
  url,
  options,
  onSuccess,
  onError,
  onNext,
  handlerKey,
  abortController
) => {
  const optionsAsString = options ? `?${optionsToURLParam(options)}` : '';
  const signal = abortController ? abortController.signal : null;
  const fetchOptions = signal ? { signal } : {};

  const data = await fetch(`${url}${optionsAsString}`, fetchOptions)
    // Middlewares
    .then(fetchHandler)
    .then(async (res) => {
      let data = res;
      if (onNext) {
        data = await nextHandler(res, onNext, fetchOptions);
      }
      return data;
    })
    // Success handling
    .then(async (res) => {
      // eslint-disable-next-line no-param-reassign
      abortController = null;
      if (onSuccess) {
        return onSuccess(res); // Success callback
      }
      return res;
    })
    .catch((err) => {
      if (err instanceof TypeError) {
        console.warn(
          `TypeError while fetching data from ${url}${optionsAsString} - Message: ${err.message}`
        );
      } else {
        console.error(
          `Error while fetching data from ${url}${optionsAsString} - Message: ${err.message}`
        );
      }
      // eslint-disable-next-line no-param-reassign
      abortController = null;
      if (onError) {
        onError(err); // Error callback
      }
    });
  return data;
};
/**
 *  Fetch wrapper for handling fetch initialization
 *
 * @param {object} data - URL search params for fetch
 * @param {function} onStart - callback to run just before fetch
 * @param {function} onSuccess - callback for fetch success
 * @param {function} onError - callback for fetch error
 * @param {function} onNext - callback for fetch next (fetching next set of data)
 * @param {string} key - key value to access apihandler object
 * @param {number|string} id - optional id if url requires it
 * @param {AbortController} abortController - AbortController for fetch
 */
const fetchWrapper = async (
  data,
  onStart,
  onSuccess,
  onError,
  onNext,
  key,
  id,
  abortController,
  overrideUrl
) => {
  if (!Object.keys(APIHandlers).includes(key)) {
    throw new Error('Invalid key provided to fetchWrapper');
  }

  const { url, options, envName } = APIHandlers[key];
  const functionWithID =
    typeof url === 'function' &&
    (typeof id === 'number' || typeof id === 'string');

  if (typeof url !== 'string' && !functionWithID) {
    throw new Error('Invalid data given to fetchWrapper');
  }

  if (typeof url === 'string' && url.indexOf('undefined') !== -1) {
    throw new Error(
      `Invalid fetch URL: Missing ${envName} environment variable`
    );
  }

  const fetchURL = overrideUrl || (functionWithID ? url(id) : url);
  const fetchOptions = overrideUrl ? null : data || options;
  if (onStart) {
    onStart();
  }
  const result = await handleFetch(
    fetchURL,
    fetchOptions,
    onSuccess,
    onError,
    onNext,
    key,
    abortController
  );
  return result;
};

export default fetchWrapper;
