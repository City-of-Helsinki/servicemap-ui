import { createSelector } from 'reselect';
import config from '../../../config';
import { filterEmptyServices, filterCities } from '../../utils/filters';
import isClient from '../../utils';
import orderUnits from '../../utils/orderUnits';
import getSortingParameters from './ordering';

const isFetching = state => state.units.isFetching;
const units = state => state.units.data;
const settings = state => state.settings;

/**
 * Returns given data after filtering it
 * @param {*} data - search data to be filtered
 * @param {*} options - options for filtering - municipality: to override city setting filtering
 * @param {*} settings - user settings, used in filtering
 */
const getFilteredData = (data, options, settings) => {
  const cities = [];
  config.cities.forEach((city) => {
    cities.push(...settings.cities[city] ? [city] : []);
  });

  let filteredData = data
    .filter(filterEmptyServices(cities));
  if (options && options.municipality) {
    filteredData = filteredData.filter(filterCities(options.municipality.split(',')));
  } else {
    filteredData = filteredData.filter(filterCities(cities));
  }
  return filteredData;
};

/**
 * Gets unordered processed result data for rendering search results
 */
export const getProcessedData = createSelector(
  [units, isFetching, settings],
  (data, isFetching, settings) => {
    // Prevent processing data if fetch is in process
    if (isFetching) return [];

    const options = {};
    const overrideMunicipality = isClient() && new URLSearchParams().get('municipality');
    if (overrideMunicipality) {
      options.municipality = overrideMunicipality;
    }

    const filteredData = getFilteredData(data, options, settings);
    return filteredData;
  },
);

/**
 * Gets ordered processed result data for rendering search results
 */
export const getOrderedData = createSelector(
  [getProcessedData, getSortingParameters],
  (unitData, sortingParameters) => {
    if (!unitData) {
      throw new Error('Invalid data provided to getOrderedData selector');
    }
    const orderedUnits = orderUnits(unitData, sortingParameters);
    return orderedUnits;
  },
);
