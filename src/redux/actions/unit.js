import fetchUnits from '../../utils/fetchGetUnits';

export const fetchHasErrored = errorMessage => ({
  type: 'UNITS_FETCH_HAS_ERRORED',
  errorMessage,
});
export const fetchIsLoading = () => ({
  type: 'UNITS_IS_FETCHING',
});
export const unitsFetchDataSuccess = units => ({
  type: 'UNITS_FETCH_DATA_SUCCESS',
  units,
});
// Thunk fetch
export const unitsFetchData = () => (dispatch) => {
  fetchUnits(dispatch, [], { fetchHasErrored, fetchIsLoading, unitsFetchDataSuccess });
};
