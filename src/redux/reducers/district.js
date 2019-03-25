const initialState = {
  isFetching: false,
  errorMessage: null,
  data: [],
  highlitedDistrict: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case 'DISTRICT_IS_FETCHING':
      return {
        ...state,
        isFetching: true,
        errorMessage: null,
      };
    case 'DISTRICT_FETCH_HAS_ERRORED':
      return {
        ...state,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case 'DISTRICT_FETCH_DATA_SUCCESS':
      return {
        ...state,
        isFetching: false,
        errorMessage: null,
        data: action.districts,
      };
    case 'SET_DISTRICT_HIGHLIGHT':
      if (state.highlitedDistrict && state.highlitedDistrict.id === action.district.id) {
        // If clicked same district set to null
        return {
          ...state,
          highlitedDistrict: null,
        };
      }
      return {
        ...state,
        highlitedDistrict: action.district,
      };

    default:
      return state;
  }
};
