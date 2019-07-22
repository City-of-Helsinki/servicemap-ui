const initialState = {
  isFetching: false,
  errorMessage: null,
  data: [],
  count: 0,
  max: 0,
  previousSearch: null,
  filters: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UNITS_IS_FETCHING':
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
        previousSearch: action.search,
      };
    case 'UNITS_FETCH_HAS_ERRORED':
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
        count: 0,
        max: 0,
      };
    case 'UNITS_FETCH_DATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        errorMessage: null,
        data: action.units,
        count: 0,
        max: 0,
      };
    case 'UNITS_FETCH_PROGRESS_UPDATE':
      return {
        ...state,
        count: action.count,
        max: action.max,
      };
    case 'SET_NEW_UNITS':
      return {
        ...state,
        data: action.data,
      };
    case 'UNITS_SET_FILTER':
      return {
        ...state,
        filters: action.filters,
      };
    default:
      return state;
  }
};
