import { addSearchParametersToObject } from '../../utils';
import { serviceFetch } from '../../utils/fetch';
import ServiceMapAPI from '../../utils/newFetch/ServiceMapAPI';
import { isEmbed } from '../../utils/path';
import { selectSelectedCities } from '../selectors/settings';
import { service } from './fetchDataActions';

// Actions
const { fetchError, isFetching, fetchSuccess, setNewCurrent } = service;

// New fetch implementation. TODO: add progress update info
export const fetchServiceUnits =
  (serviceIdList) => async (dispatch, getState) => {
    dispatch(isFetching());

    try {
      // TODO organizations should have similar handling here
      let municipality;
      if (global.window) {
        const search = new URLSearchParams(window.location.search);
        municipality = search.get('municipality') || search.get('city');
      }

      const embed = isEmbed();
      if (!municipality && !embed) {
        municipality = selectSelectedCities(getState()).join(',');
      }

      let options = {};

      if (municipality) {
        options.municipality = municipality;
      }

      // Add search parameters to options
      options = addSearchParametersToObject(options, ['city']);

      // Handle fetch
      const smAPI = new ServiceMapAPI();
      const serviceUnits = await smAPI.serviceUnits(serviceIdList, options);

      // Filter out duplicate units
      const distinctData = Array.from(
        new Set(serviceUnits.map((x) => x.id))
      ).map((id) => {
        const obj = serviceUnits.find((s) => id === s.id);
        obj.object_type = 'unit';
        return obj;
      });

      dispatch(fetchSuccess(distinctData));
    } catch (e) {
      dispatch(fetchError(e.message));
    }
  };

export const fetchService = (serviceId) => async (dispatch) => {
  const onStart = () => dispatch(isFetching());
  const onSuccess = (data) => {
    dispatch(setNewCurrent(data));
    dispatch(fetchServiceUnits(serviceId));
  };
  const onError = (e) => dispatch(fetchError(e.message));
  const onNext = null;

  // Fetch data
  serviceFetch(null, onStart, onSuccess, onError, onNext, serviceId);
};

export const setNewCurrentService = (service) => async (dispatch) => {
  if (service) {
    dispatch(setNewCurrent(service));
    dispatch(fetchServiceUnits(service.id));
  }
};
