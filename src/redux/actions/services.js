import { serviceFetch, unitsFetch } from '../../utils/fetch';

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
export const serviceFetchProgressUpdate = (count, max) => ({
  type: 'SERVICE_UNITS_FETCH_PROGRESS_UPDATE',
  count,
  max,
});
export const serviceSetCurrent = service => ({
  type: 'SERVICE_SET_CURRENT_SERVICE',
  service,
});

// Thunk fetch
export const fetchServiceUnits = serviceId => async (dispatch) => {
  const onStart = () => dispatch(fetchIsLoading());
  const onSuccess = (data) => {
    // Filter out duplicate units
    const distinctData = Array.from(new Set(data.map(x => x.id))).map((id) => {
      const obj = data.find(s => id === s.id);
      return obj;
    });
    dispatch(serviceFetchDataSuccess(distinctData));
  };
  const onError = e => dispatch(fetchHasErrored(e.message));
  const onNext = (resultTotal, response) => {
    dispatch(serviceFetchProgressUpdate(resultTotal.length, response.count));
  };

  const options = {
    service: serviceId,
    page_size: 50,
    only: 'name,accessibility_shortcoming_count',
  };

  // Fetch data
  unitsFetch(options, onStart, onSuccess, onError, onNext);
};

export const fetchService = serviceId => async (dispatch) => {
  const onStart = () => dispatch(fetchIsLoading());
  const onSuccess = (data) => {
    dispatch(serviceSetCurrent(data));
    dispatch(fetchServiceUnits(serviceId));
  };
  const onError = e => dispatch(fetchHasErrored(e.message));
  const onNext = null;

  // Fetch data
  serviceFetch(null, onStart, onSuccess, onError, onNext, serviceId);
};

export const setNewCurrentService = service => async (dispatch) => {
  if (service) {
    dispatch(serviceSetCurrent(service));
    dispatch(fetchServiceUnits(service.id, []));
  }
};
