import fetchDistricts from '../../views/Map/utils/fetchDistricts';

export const fetchHasErrored = errorMessage => ({
  type: 'DISTRICT_FETCH_HAS_ERRORED',
  errorMessage,
});
export const fetchIsLoading = () => ({
  type: 'DISTRICT_IS_FETCHING',
});
export const districtFetchDataSuccess = districts => ({
  type: 'DISTRICT_FETCH_DATA_SUCCESS',
  districts,
});

export const fetchDistrictsData = latlng => (dispatch) => {
  dispatch(fetchIsLoading());
  fetchDistricts(latlng)
    .then((response) => {
      dispatch(districtFetchDataSuccess(response));
    })
    .catch((e) => {
      dispatch(fetchHasErrored(e.message));
    });
};
