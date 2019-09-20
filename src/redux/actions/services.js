import { serviceFetch, unitsFetch } from '../../utils/fetch';
import { service } from './fetchDataActions';

// Actions
const {
  fetchError, isFetching, fetchSuccess, fetchProgressUpdate, setNewCurrent,
} = service;

// Thunk fetch
export const fetchServiceUnits = serviceId => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    // Filter out duplicate units
    const distinctData = Array.from(new Set(data.map(x => x.id))).map((id) => {
      const obj = data.find(s => id === s.id);
      obj.object_type = 'unit';
      return obj;
    });
    dispatch(fetchSuccess(distinctData));
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = (resultTotal, response) => {
    dispatch(fetchProgressUpdate(resultTotal.length, response.count));
  };

  const options = {
    service: serviceId,
    page_size: 50,
    only: 'name,accessibility_shortcoming_count,location,municipality',
  };

  // Fetch data
  unitsFetch(options, onStart, onSuccess, onError, onNext);
};

export const fetchService = serviceId => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    dispatch(setNewCurrent(data));
    dispatch(fetchServiceUnits(serviceId));
  };
  const onError = e => dispatch(fetchError(e.message));
  const onNext = null;

  // Fetch data
  serviceFetch(null, onStart, onSuccess, onError, onNext, serviceId);
};

export const setNewCurrentService = service => async (dispatch) => {
  if (service) {
    dispatch(setNewCurrent(service));
    dispatch(fetchServiceUnits(service.id, []));
  }
};
