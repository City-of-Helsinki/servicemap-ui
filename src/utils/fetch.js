/* eslint-disable no-await-in-loop */
import config from '../../config';

// *****************
// CONFIGURATIONS
// *****************

// API handlers
const APIHandlers = {
  address: {
    url: `${config.serviceMapAPI.root}/address/`,
    options: {
      page_size: 5,
    },
  },
  district: {
    url: `${config.serviceMapAPI.root}/administrative_division/`,
    options: {
      geometry: true,
    },
  },
  search: {
    url: `${config.serviceMapAPI.root}/search/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count',
      geometry: true,
    },
  },
  service: {
    url: id => `${config.serviceMapAPI.root}/service/${id}/`,
    options: {},
  },
  unit: {
    url: id => `${config.serviceMapAPI.root}/unit/${id}/`,
    options: {
      accessibility_description: true,
      include: 'service_nodes,services',
      geometry: true,
    },
  },
  units: {
    url: `${config.serviceMapAPI.root}/unit/`,
    options: {
      page_size: 100,
    },

  },
  unitEvents: {
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
/*
const testMiddleware = async (data) => {
  console.group('TestMiddleware: Logger');
  console.log(data);
  console.groupEnd('TestMiddleware: Logger');
  return data;
};
*/

const handleNext = async (allData, response, onNext, fetchOptions) => {
  if (response && response.next) {
    if (onNext) {
      onNext(allData, response);
    }
    const newResponse = await fetch(response.next, fetchOptions)
      .then(responseToJson)
      .catch((e) => {
        console.log('Fetch next error', e);
        throw new Error('Problem in fetch next');
      });

    const totalData = [...allData, ...newResponse.results];
    const data = await handleNext(totalData, newResponse, onNext, fetchOptions);
    return data;
  }

  return allData;
};

/**
 * Middleware to handle next fetching
 */
const nextHandler = async (data, onNext, fetchOptions) => {
  if (data && data.next && data.results) {
    const newData = await handleNext(data.results, data, onNext, fetchOptions);
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

export const initiateFetch = async (
  url, options, onSuccess, onError, onNext, handlerKey, abortController,
) => {
  const optionsAsString = options ? `/?${optionsToURLParam(options)}` : '';
  console.log('Fetch URL', `${url}${optionsAsString}`);
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
    // .then(testMiddleware)
    // Success handling
    .then(async (res) => {
      console.log('Response after fetchHandler', res);
      // eslint-disable-next-line no-param-reassign
      abortController = null;
      if (onSuccess) {
        return onSuccess(res); // Success callback
      }
      return res;
    })
    .catch((err) => {
      console.log('Error:', err);
      // eslint-disable-next-line no-param-reassign
      abortController = null;
      if (onError) {
        onError(err); // Error callback
      }
    });
  return data;
};

const fetchWrapper = async (
  data, onStart, onSuccess, onError, onNext, key, id, abortController,
) => {
  if (!Object.keys(APIHandlers).includes(key)) {
    throw new Error('Invalid key provided to fetchWrapper');
  }

  const { url, options } = APIHandlers[key];
  const functionWithID = typeof url === 'function' && (typeof id === 'number' || typeof id === 'string');
  if (typeof url !== 'string' && !functionWithID) {
    throw new Error('Invalid data given to fetchWrapper');
  }

  const fetchURL = functionWithID ? url(id) : url;
  const fetchOptions = data || options;
  if (onStart) {
    onStart();
  }
  const result = await initiateFetch(
    fetchURL, fetchOptions, onSuccess, onError, onNext, key, abortController,
  );
  return result;
};

export const searchFetch = async (data, onStart, onSuccess, onError, onNext, abortController) => {
  console.log('Search fetch', data);
  const { options } = APIHandlers.search;
  const response = await fetchWrapper({ ...options, ...data }, onStart, onSuccess, onError, onNext, 'search', null, abortController);
  return response;
};

export const unitEventsFetch = async (data, onStart, onSuccess, onError, onNext) => {
  console.log('Unit events fetch', data);
  const { options } = APIHandlers.unitEvents;
  const response = await fetchWrapper({ ...options, ...data }, onStart, onSuccess, onError, onNext, 'unitEvents');
  return response;
};

export const selectedUnitFetch = async (data, onStart, onSuccess, onError, onNext, id) => {
  console.log('SelectedUnit fetch', data);
  const response = await fetchWrapper(data, onStart, onSuccess, onError, onNext, 'unit', id);
  return response;
};

export const unitsFetch = async (data, onStart, onSuccess, onError, onNext) => {
  console.log('Units fetch', data);
  const response = await fetchWrapper(data, onStart, onSuccess, onError, onNext, 'units');
  return response;
};

export const serviceFetch = async (data, onStart, onSuccess, onError, onNext, id) => {
  console.log('Service fetch', data);
  const response = fetchWrapper(data, onStart, onSuccess, onError, onNext, 'service', id);
  return response;
};

export const addressFetch = async (data, onStart, onSuccess, onError, onNext) => {
  console.log('Address fetch', data);
  const response = fetchWrapper(data, onStart, onSuccess, onError, onNext, 'address');
  return response;
};

export const districtFetch = async (data, onStart, onSuccess, onError, onNext) => {
  console.log('District fetch', data);
  const response = fetchWrapper(data, onStart, onSuccess, onError, onNext, 'district');
  return response;
};
