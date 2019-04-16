import config from '../../../config';

export const fetchHasErrored = errorMessage => ({
  type: 'SERVICE_UNITS_FETCH_HAS_ERRORED',
  errorMessage,
});
export const fetchIsLoading = () => ({
  type: 'SERVICE_UNITS_IS_FETCHING',
});
export const serviceFetchDataSuccess = units => ({
  type: 'SERVICE_UNITS_FETCH_DATA_SUCCESS',
  units,
});

export const fetchServiceUnits = serviceId => async (dispatch) => {
  // Fetch service and its units
  const { unit } = config;
  const url = unit.api_url;
  let serviceName = '';

  dispatch(fetchIsLoading());

  // Fetch service and its name
  let response = await fetch(`${url}service/${serviceId}`);
  if (response.ok && response.status === 200) {
    const data = await response.json();
    serviceName = data.name;

    // Fetch service units
    response = await fetch(`${url}unit/?service=${serviceId}&page_size=500`);
    if (response.ok && response.status === 200) {
      const data = await response.json();
      dispatch(serviceFetchDataSuccess({ id: serviceId, name: serviceName, units: data }));
    } else {
      dispatch(fetchHasErrored('Units not found'));
    }
  } else {
    dispatch(fetchHasErrored('Service not found'));
  }
};
