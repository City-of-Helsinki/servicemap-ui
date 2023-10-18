import { createSelector } from 'reselect';
import config from '../../../config';
import { isEmbed } from '../../utils/path';
import { filterEmptyServices, filterCitiesAndOrganizations, filterResultTypes } from '../../utils/filters';
import isClient from '../../utils';
import orderUnits from '../../utils/orderUnits';
import getSortingParameters from './ordering';
import { selectCities, selectOrganizations } from './settings';

const isFetching = state => state.searchResults.isFetching;
const results = state => state.searchResults.data;

/**
 * Returns given data after filtering it
 * @param {*} data - search data to be filtered
 * @param {*} options - options for filtering - municipality: to override city setting filtering
 * @param {*} settings - user settings, used in filtering
 */
export const getFilteredData = (data, settings, options) => {
  let cities = [];
  config.cities.forEach((city) => {
    cities.push(...settings.cities[city] ? [city] : []);
  });

  let organizations = [];
  config.organizations.forEach((organization) => {
    organizations.push(...settings.organizations[organization.id] ? [organization.id] : []);
  });

  let embed = false;
  if (global.window) {
    embed = isEmbed({ url: window.location });
  }

  let filteredData = data
    .filter(filterEmptyServices(cities, organizations))
    .filter(filterResultTypes());

  if (!embed) {
    if (options) {
      if (options.municipality) cities = options.municipality.split(',');
      if (options.organizations) organizations = options.organizations.split(',');
    }
    filteredData = filteredData.filter(filterCitiesAndOrganizations(cities, organizations));
  }
  return filteredData;
};

/**
 * Gets unordered processed result data for rendering search results
 */
export const getProcessedData = createSelector(
  [results, isFetching, selectCities, selectOrganizations],
  (data, isFetching, cities, organizations) => {
    // Prevent processing data if fetch is in process
    if (isFetching) return [];

    const options = {};
    const overrideMunicipality = isClient() && new URLSearchParams().get('municipality');
    if (overrideMunicipality) {
      options.municipality = overrideMunicipality;
    }

    return getFilteredData(data, { cities, organizations }, options);
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
    return orderUnits(unitData, sortingParameters);
  },
);
