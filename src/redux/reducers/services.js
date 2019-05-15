const initialState = {
  isFetching: false,
  errorMessage: null,
  current: null,
  count: 0,
  max: 0,
  units: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SERVICE_SET_CURRENT_SERVICE':
      return {
        ...state,
        current: action.service,
        errorMessage: null,
        isFetching: false,
        units: [],
      };
    case 'SERVICE_UNITS_IS_FETCHING':
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
      };
    case 'SERVICE_UNITS_FETCH_HAS_ERRORED':
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case 'SERVICE_UNITS_FETCH_DATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        errorMessage: null,
        units: action.units,
      };
    case 'SERVICE_UNITS_FETCH_PROGRESS_UPDATE':
      return {
        ...state,
        count: action.count,
        max: action.max,
      };
    default:
      return state;
  }
};
