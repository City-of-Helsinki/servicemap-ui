import { createSelector } from 'reselect';
import isClient from '../../utils';
import {
  filterCitiesAndOrganizations, filterEmptyServices, filterResultTypes,
} from '../../utils/filters';
import orderUnits from '../../utils/orderUnits';
import { isEmbed } from '../../utils/path';
import getSortingParameters from './ordering';
import { selectSelectedCities, selectSelectedOrganizationIds } from './settings';

const isFetching = state => state.searchResults.isFetching;
const results = state => state.searchResults.data;

const getFilteredData = (data, cities, organizationIds) => data
  .filter(filterEmptyServices(cities, organizationIds))
  .filter(filterResultTypes());

/**
 * Returns given data after filtering it
 * @param {*} data - search data to be filtered
 * @param {*} cities - selected cities
 * @param {*} organizationIds - selected organization ids
 * @param {*} options - options for filtering - municipality: to override city setting filtering
 */
export const getCityFilteredData = (data, cities, organizationIds, options = null) => {
  const filteredData = getFilteredData(data, cities, organizationIds);
  const embed = !!global.window && isEmbed({ url: window.location });

  if (embed) {
    return filteredData;
  }
  const cities2 = options?.municipality?.split(',') || cities;
  const orgIds2 = options?.organizations?.split(',') || organizationIds;
  return filteredData.filter(filterCitiesAndOrganizations(cities2, orgIds2));
};

/**
 * Gets ordered result data for rendering search results
 */
export const getOrderedSearchResultData = createSelector(
  [results, isFetching, getSortingParameters],
  (unitData, isFetching, sortingParameters) => {
    if (isFetching) {
      return [];
    }
    if (!unitData) {
      throw new Error('Invalid data provided to getOrderedData selector');
    }
    return orderUnits(unitData, sortingParameters);
  },
);

/**
 * Gets ordered and filtered (by cities and orgs) result data for rendering search results
 */
export const getOrderedAndFilteredSearchResultData = createSelector(
  [getOrderedSearchResultData, selectSelectedCities, selectSelectedOrganizationIds],
  (unitData, selectedCities, selectedOrganizationIds) => {
    const options = {};
    const overrideMunicipality = isClient() && new URLSearchParams().get('municipality');
    if (overrideMunicipality) {
      options.municipality = overrideMunicipality;
    }

    return getCityFilteredData(unitData, selectedCities, selectedOrganizationIds, options);
  },
);
