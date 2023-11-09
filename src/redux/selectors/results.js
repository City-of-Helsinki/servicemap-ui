import { createSelector } from 'reselect';
import { isEmbed } from '../../utils/path';
import { filterEmptyServices, filterCitiesAndOrganizations, filterResultTypes } from '../../utils/filters';
import isClient from '../../utils';
import orderUnits from '../../utils/orderUnits';
import getSortingParameters from './ordering';
import { selectSelectedCities, selectSelectedOrganizationIds } from './settings';

const isFetching = state => state.searchResults.isFetching;
const results = state => state.searchResults.data;

/**
 * Returns given data after filtering it
 * @param {*} data - search data to be filtered
 * @param {*} cities - selected cities
 * @param {*} organizationIds - selected organization ids
 * @param {*} options - options for filtering - municipality: to override city setting filtering
 */
export const getFilteredData = (data, cities, organizationIds, options = null) => {
  let embed = false;
  if (global.window) {
    embed = isEmbed({ url: window.location });
  }

  const filteredData = data
    .filter(filterEmptyServices(cities, organizationIds))
    .filter(filterResultTypes());

  if (embed) {
    return filteredData;
  }
  const cities2 = options?.municipality?.split(',') || cities;
  const orgIds2 = options?.organizations?.split(',') || organizationIds;
  return filteredData.filter(filterCitiesAndOrganizations(cities2, orgIds2));
};

/**
 * Gets unordered processed result data for rendering search results
 */
export const getProcessedData = createSelector(
  [results, isFetching, selectSelectedCities, selectSelectedOrganizationIds],
  (data, isFetching, selectedCities, selectedOrganizationIds) => {
    // Prevent processing data if fetch is in process
    if (isFetching) return [];

    const options = {};
    const overrideMunicipality = isClient() && new URLSearchParams().get('municipality');
    if (overrideMunicipality) {
      options.municipality = overrideMunicipality;
    }

    return getFilteredData(data, selectedCities, selectedOrganizationIds, options);
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
