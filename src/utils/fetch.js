/* eslint-disable no-await-in-loop */
import config from '../../config';
import isClient from '.';

// *****************
// CONFIGURATIONS
// *****************

// API handlers
const APIHandlers = {
  search: {
    abortController: null,
    url: `${config.serviceMapAPI.root}/search/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count',
      geometry: true,
    },
  },
  service: {
    abortController: null,
    url: id => `${config.serviceMapAPI.root}/service/${id}/`,
    options: {},
  },
  unit: {
    abortController: null,
    url: id => `${config.serviceMapAPI.root}/unit/${id}/`,
    options: {
      accessibility_description: true,
      include: 'service_nodes,services',
      geometry: true,
    },
  },
  units: {
    abortController: null,
    url: `${config.serviceMapAPI.root}/unit/`,
    options: {
      geometry: true,
      page_size: 100,
    },

  },
  unitEvents: {
    abortController: null,
    url: `${config.eventsAPI.root}/event/`,
    options: {
      type: 'event',
      start: 'today',
      sort: 'start_time',
      include: 'location',
    },
  },
};
// const serviceURL = `${config.serviceMapAPI.root}/service/`;

// *****************
// Abort controller
// *****************
const setNewAbortController = (handlerKey) => {
  if (!handlerKey) {
    return;
  }
  APIHandlers[handlerKey].abortController = isClient() ? new AbortController() : null;

  const { abortController } = APIHandlers[handlerKey];
  const { signal } = abortController;
  signal.addEventListener('abort', () => {
    // Logs true:
    console.log('Abort event', signal.aborted);
  });
};

export const abortFetch = (key) => {
  if (!key || !Object.keys(APIHandlers).includes(key)) {
    return;
  }
  const { abortController } = APIHandlers[key];
  if (abortController) {
    abortController.abort();
  }
};

// *****************
// MIDDLEWARES
// *****************

const responseToJson = response => response.json();

/**
 * Middleware to handle fetch status check and json transform
 * @param {*} res
 */
const fetchHandler = (res) => {
  // console.log('Response:', res);
  if (res.status !== 200) {
    throw new Error(`Looks like there was a problem. Status Code: ${
      res.status}`);
  }
  return responseToJson(res);
};

const testMiddleware = async (data) => {
  console.group('TestMiddleware: Logger');
  console.log(data);
  console.groupEnd('TestMiddleware: Logger');
  return data;
};

const handleNext = async (allData, response, onNext, fetchOptions) => {
  // console.group('HandleNext');
  // console.log(allData);
  if (response && response.next) {
    if (onNext) {
      onNext(allData, response);
    }
    // console.log('Fetch options: ', APIHandlers[handlerKey].abortController);
    // const { signal } = APIHandlers[handlerKey].abortController;
    console.log('Next fetch options', fetchOptions);
    const newResponse = await fetch(response.next, fetchOptions)
      .then(responseToJson)
      .catch((e) => {
        console.log('Fetch next error', e);
        throw new Error('Problem in fetch next');
      });
    const totalData = [...allData, ...newResponse.results];
    // console.log(newResponse, totalData);

    // console.groupEnd('HandleNext');
    const data = await handleNext(totalData, newResponse, onNext, fetchOptions);
    return data;
  }
  // console.groupEnd('HandleNext');

  return allData;
};

/**
 * Middleware to handle next fetching
 */
const nextHandler = async (data, onNext, fetchOptions) => {
  // console.log('NextHandler: ', data);
  if (data && data.next && data.results) {
    const newData = await handleNext(data.results, data, onNext, fetchOptions);
    // console.log('Next new data', newData);
    return newData;
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

export const initiateFetch = async (url, options, onSuccess, onError, onNext, handlerKey) => {
  const optionsAsString = options ? `/?${optionsToURLParam(options)}` : '';
  console.log('Search URL', `${url}${optionsAsString}`);
  const { abortController } = APIHandlers[handlerKey];
  const signal = abortController ? abortController.signal : null;
  const fetchOptions = signal ? { signal } : {};

  const data = fetch(`${url}${optionsAsString}`, fetchOptions)
    // Middlewares
    .then(fetchHandler)
    .then(async (res) => {
      let data = res;
      if (onNext) {
        data = await nextHandler(res, onNext, fetchOptions);
      }
      return data;
    })
    // .then(testMiddleware)
    // Success handling
    .then(async (res) => {
      console.log('Response after fetchHandler', res);

      onSuccess(res); // Success callback
      APIHandlers[handlerKey].abortController = null;
      return res;
    })
    .catch((err) => {
      console.log('Error:', err);
      onError(err); // Error callback
      APIHandlers[handlerKey].abortController = null;
    });
  return data;
};

const fetchWrapper = (data, onStart, onSuccess, onError, onNext, key, id) => {
  if (!Object.keys(APIHandlers).includes(key)) {
    throw new Error('Invalid key provided to fetchWrapper');
  }

  const { url, options } = APIHandlers[key];
  const functionWithID = typeof url === 'function' && (typeof id === 'number' || typeof id === 'string');
  if (typeof url !== 'string' && !functionWithID) {
    throw new Error('Invalid data given to fetchWrapper');
  }

  const fetchURL = functionWithID ? url(id) : url;
  const fetchOptions = { ...data, ...options };
  abortFetch(key);
  setNewAbortController(key);
  onStart();
  return initiateFetch(fetchURL, fetchOptions, onSuccess, onError, onNext, key);
};

export const searchFetch = (data, onStart, onSuccess, onError, onNext) => {
  console.log('Search fetch', data);
  return fetchWrapper(data, onStart, onSuccess, onError, onNext, 'search');
};

export const unitEventsFetch = (data, onStart, onSuccess, onError, onNext) => {
  console.log('Unit events fetch', data);
  return fetchWrapper(data, onStart, onSuccess, onError, onNext, 'unitEvents');
};

export const selectedUnitFetch = (data, onStart, onSuccess, onError, onNext, id) => {
  console.log('SelectedUnit fetch', data);
  return fetchWrapper(data, onStart, onSuccess, onError, onNext, 'unit', id);
};

export const serviceUnitsFetch = (data, onStart, onSuccess, onError, onNext) => {
  console.log('ServiceUnits fetch', data);
  return fetchWrapper(data, onStart, onSuccess, onError, onNext, 'units');
};

export const serviceFetch = (data, onStart, onSuccess, onError, onNext, id) => {
  console.log('Service fetch', data);
  return fetchWrapper(data, onStart, onSuccess, onError, onNext, 'service', id);
};
