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
export const fetchServiceUnits = (
  serviceId,
  allData = [],
  next = null,
) => async (dispatch, getState) => {
  // Fetch service data
  const { unit } = config;
  const url = unit.apiUrl;

  const { service } = getState();
  const { isFetching } = service;

  // If not currently fetching init fetch
  if (!isFetching) {
    dispatch(fetchIsLoading());
  }

  // If getting next page or first fetch proceed to actual fetch
  if (next || !isFetching) {
    // Fetch service units
    try {
      let response = null;
      if (next) {
        response = await fetch(next);
      } else {
        response = await fetch(`${url}unit/?service=${serviceId}&geometry=true&page_size=100`);
      }
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const data = await response.json();
      const newData = [...allData, ...data.results];
      if (data.next) {
        // Fetch the next page if response has more than one page of results
        dispatch(serviceFetchProgressUpdate(newData.length, data.count));
        dispatch(fetchServiceUnits(serviceId, newData, data.next));
      } else {
        // Filter out duplicate units
        const distinctData = Array.from(new Set(newData.map(x => x.id))).map((id) => {
          const obj = newData.find(s => id === s.id);
          return obj;
        });
        dispatch(serviceFetchDataSuccess(distinctData));
      }
    } catch (e) {
      dispatch(fetchHasErrored(e.message));
    }
  }
};

export const fetchService = serviceId => async (dispatch) => {
  // Fetch service data
  const { unit } = config;
  const url = unit.apiUrl;

  dispatch(fetchIsLoading());

  // Fetch service data
  try {
    const response = await fetch(`${url}service/${serviceId}`);

    if (response.ok && response.status === 200) {
      const service = await response.json();
      dispatch(serviceSetCurrent(service));
      dispatch(fetchServiceUnits(serviceId, []));
    } else {
      throw Error(response.statusText);
    }
  } catch (e) {
    dispatch(fetchHasErrored(e.message));
  }
};

export const setNewCurrentService = service => async (dispatch) => {
  if (service) {
    dispatch(serviceSetCurrent(service));
    dispatch(fetchServiceUnits(service.id, []));
  }
};
