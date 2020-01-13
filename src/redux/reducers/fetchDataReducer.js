// Reducers for fetching data sets
const dataSetInitialState = {
  data: [],
  current: null,
  count: 0,
  errorMessage: null,
  isFetching: false,
  max: 0,
  previousSearch: null,
};

const dataSetReducer = (state, action, prefix) => {
  switch (action.type) {
    case `${prefix}_IS_FETCHING`:
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
        previousSearch: action.search,
      };
    case `${prefix}_FETCH_HAS_ERRORED`:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
        count: 0,
        max: 0,
      };
    case `${prefix}_FETCH_DATA_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        errorMessage: null,
        data: action.data,
        count: 0,
        max: 0,
      };
    case `${prefix}_FETCH_PROGRESS_UPDATE`:
      return {
        ...state,
        count: action.count,
        max: action.max,
      };
    case `${prefix}_SET_NEW_DATA`:
      return {
        ...state,
        data: action.data,
      };
    case `${prefix}_SET_NEW_CURRENT`:
      return {
        ...state,
        current: action.current,
        errorMessage: null,
        isFetching: false,
        data: [],
      };
    default:
      return state;
  }
};
// Reducers for fetching single data
const dataSingleInitialState = {
  isFetching: false,
  isFetchingMore: false,
  errorMessage: null,
  data: null,
  count: 0,
};

const dataSingle = (state, action, prefix) => {
  switch (action.type) {
    case `${prefix}_IS_FETCHING`:
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
      };
    case `${prefix}_IS_FETCHING_MORE`:
      return {
        ...state,
        isFetchingMore: true,
        errorMessage: null,
      };
    case `${prefix}_FETCH_HAS_ERRORED`:
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case `${prefix}_FETCH_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        isFetchingMore: false,
        errorMessage: null,
        data: action.data,
        count: action.count,
        next: action.next,
      };
    case `${prefix}_FETCH_MORE_SUCCESS`:
      return {
        ...state,
        isFetchingMore: false,
        errorMessage: null,
        data: [...state.data, ...action.data],
        next: action.next,
      };
    case `${prefix}_SET_DATA`:
      return {
        ...state,
        data: action.data,
        count: action.count,
      };
    default:
      return state;
  }
};


// Fetch data set reducers
export const units = (state = dataSetInitialState, action) => dataSetReducer(state, action, 'UNITS');
export const service = (state = dataSetInitialState, action) => dataSetReducer(state, action, 'SERVICE');

// Fetch data single reducers
export const selectedUnit = (state = dataSingleInitialState, action) => dataSingle(state, action, 'SELECTED_UNIT');
export const accessibilitySentences = (state = dataSingleInitialState, action) => dataSingle(state, action, 'SELECTED_UNIT_ACCESSIBILITY_SENTENCES');
export const reservations = (state = dataSingleInitialState, action) => dataSingle(state, action, 'SELECTED_UNIT_RESERVATIONS');
export const unitEvents = (state = dataSingleInitialState, action) => dataSingle(state, action, 'SELECTED_UNIT_EVENTS');
