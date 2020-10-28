import { serviceFetch, unitsFetch } from '../../utils/fetch';
import { service } from './fetchDataActions';
import { addSearchParametersToObject } from '../../utils';
import SettingsUtility from '../../utils/settings';

// Actions
const {
  fetchError, isFetching, fetchSuccess, fetchProgressUpdate, setNewCurrent,
} = service;

// Thunk fetch
export const fetchServiceUnits = serviceId => async (dispatch, getState) => {
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
  let municipality;
  if (global.window) {
    const search = new URLSearchParams(window.location.search);
    municipality = search.get('municipality') || search.get('city');
  }

  if (!municipality) {
    const citySettings = SettingsUtility.getActiveCitySettings(getState());
    municipality = citySettings.join(',');
  }

  let options = {
    service: serviceId,
    page_size: 50,
    only: 'street_address,name,accessibility_shortcoming_count,location,municipality,contract_type',
  };

  if (municipality) {
    options.municipality = municipality;
  }

  // Add search parameters to options
  options = addSearchParametersToObject(options, ['city']);

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
