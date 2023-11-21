import { createSelector } from 'reselect';
import { getCityAndOrgFilteredData } from '../../utils/filters';
import orderUnits from '../../utils/orderUnits';
import getSortingParameters from './ordering';
import { selectSelectedCities, selectSelectedOrganizationIds } from './settings';

const isFetching = state => state.searchResults.isFetching;
const results = state => state.searchResults.data;

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
  (unitData, cities, orgIds) => getCityAndOrgFilteredData(unitData, cities, orgIds),
);
