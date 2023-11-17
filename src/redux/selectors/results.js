import { createSelector } from 'reselect';
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
 */
export const getCityFilteredData = (data, cities, organizationIds) => {
  const filteredData = getFilteredData(data, cities, organizationIds);
  const embed = !!global.window && isEmbed({ url: window.location });

  if (embed) {
    return filteredData;
  }
  return filteredData.filter(filterCitiesAndOrganizations(cities, organizationIds));
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
  (unitData, cities, orgIds) => getCityFilteredData(unitData, cities, orgIds),
);
