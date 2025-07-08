// Actions for fetching multiples
const dataSet = (prefix) => ({
  isFetching: (search) => ({
    type: `${prefix}_IS_FETCHING`,
    search,
  }),
  fetchError: (errorMessage) => ({
    type: `${prefix}_FETCH_HAS_ERRORED`,
    errorMessage,
  }),
  fetchSuccess: (data) => ({
    type: `${prefix}_FETCH_DATA_SUCCESS`,
    data,
  }),
  fetchProgressUpdate: (count, max, next) => ({
    type: `${prefix}_FETCH_PROGRESS_UPDATE`,
    count,
    max,
    next,
  }),
  fetchProgressUpdateConcurrent: (count, max) => ({
    type: `${prefix}_FETCH_PROGRESS_UPDATE_CONCURRENT`,
    count,
    max,
  }),
  fetchMoreSuccess: (data) => ({
    type: `${prefix}_FETCH_MORE_SUCCESS`,
    data,
  }),
  setNewData: (data) => ({
    type: `${prefix}_SET_NEW_DATA`,
    data,
  }),
  setNewCurrent: (current) => ({
    type: `${prefix}_SET_NEW_CURRENT`,
    current,
  }),
  isAdditiveFetching: (search) => ({
    type: `${prefix}_ADDITIVE_IS_FETCHING`,
    search,
  }),
  fetchAdditiveError: (errorMessage) => ({
    type: `${prefix}_ADDITIVE_FETCH_HAS_ERRORED`,
    errorMessage,
  }),
  fetchAdditiveProgressUpdate: (data) => ({
    type: `${prefix}_ADDITIVE_FETCH_PROGRESS_UPDATE`,
    count: data.count,
    max: data.max,
  }),
  fetchAdditiveSuccess: (data) => ({
    type: `${prefix}_ADDITIVE_FETCH_DATA_SUCCESS`,
    data,
  }),
});

// Actions for fetching singles
const dataSingle = (prefix) => ({
  isFetching: () => ({
    type: `${prefix}_IS_FETCHING`,
  }),
  fetchError: (errorMessage) => ({
    type: `${prefix}_FETCH_HAS_ERRORED`,
    errorMessage,
  }),
  fetchSuccess: (data, meta) => ({
    type: `${prefix}_FETCH_SUCCESS`,
    data,
    count: meta && meta.count,
    next: meta && meta.next,
  }),
  fetchMoreSuccess: (data, meta) => ({
    type: `${prefix}_FETCH_MORE_SUCCESS`,
    data,
    next: meta && meta.next,
  }),
  setNewData: (data) => ({
    type: `${prefix}_SET_DATA`,
    data,
  }),
});

// Data fetch multiple
export const searchResults = dataSet('SEARCH_RESULTS');
export const service = dataSet('SERVICE');
export const events = dataSet('SELECTED_UNIT_EVENTS');
export const reservations = dataSet('SELECTED_UNIT_RESERVATIONS');
export const alertNews = dataSet('ALERT_NEWS');
export const alertErrors = dataSet('ALERT_ERRORS');
export const statisticalDistrictUnits = dataSet('STATISTICAL_DISTRICT_UNITS');
export const statisticalDistrictServices = dataSet(
  'STATISTICAL_DISTRICT_SERVICES'
);

// Data fetch single
export const selectedUnit = dataSingle('SELECTED_UNIT');
export const accessibilitySentences = dataSingle(
  'SELECTED_UNIT_ACCESSIBILITY_SENTENCES'
);
export const hearingMaps = dataSingle('SELECTED_UNIT_HEARING_MAPS');
export const redirectService = dataSingle('REDIRECT_SERVICE');
