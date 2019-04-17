const initialState = {
  isFetching: false,
  errorMessage: null,
  data: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SELECTED_UNIT_IS_FETCHING':
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
      };
    case 'SELECTED_UNIT_HAS_ERRORED':
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case 'SELECTED_UNIT_FETCH_DATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        errorMessage: null,
        data: action.unit,
      };
    case 'SET_SELECTED_UNIT':
      return {
        ...state,
        data: action.unit,
      };
    default:
      return state;
  }
};
