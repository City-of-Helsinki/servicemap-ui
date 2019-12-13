import { APIHandlers } from './constants';
import fetchWrapper from './fetch';

const wrapperClosure = (key, options = {}) => async (
  data, onStart, onSuccess, onError, onNext, id, abortController,
) => {
  const response = await fetchWrapper(
    { ...options, ...data },
    onStart,
    onSuccess,
    onError,
    onNext,
    key,
    id,
    abortController,
  );
  return response;
};

export const accessibilitySentencesFetch = wrapperClosure('accessibilitySentences');
export const searchFetch = wrapperClosure('search', APIHandlers.search.options);
export const unitEventsFetch = wrapperClosure('unitEvents', APIHandlers.unitEvents.options);
export const selectedUnitFetch = wrapperClosure('unit', APIHandlers.unit.options);
export const unitsFetch = wrapperClosure('units', APIHandlers.units.options);
export const nodeFetch = wrapperClosure('node', APIHandlers.node.options);
export const serviceFetch = wrapperClosure('service');
export const addressFetch = wrapperClosure('address');
export const districtFetch = wrapperClosure('district');
export const eventFetch = wrapperClosure('event');
export const reservationsFetch = wrapperClosure('reservations');
