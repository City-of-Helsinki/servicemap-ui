import { createSelector } from 'reselect';
import { getCityAndOrgFilteredData } from '../../utils/filters';
import { orderUnits } from '../../utils/orderUnits';
import getSortingParameters from './ordering';
import { selectSelectedCities, selectSelectedOrganizationIds } from './settings';

export const selectResultsIsFetching = state => state.searchResults.isFetching;
export const selectResultsPreviousSearch = state => state.searchResults.previousSearch;
export const selectResultsData = state => state.searchResults.data;
export const selectSearchResults = state => state.searchResults;

/**
 * Gets ordered result data for rendering search results
 */
export const getOrderedSearchResultData = createSelector(
  [selectResultsData, selectResultsIsFetching, getSortingParameters],
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
 * Gets filtered (by cities and orgs) result data for rendering search results
 */
export const getFilteredSearchResultData = createSelector(
  [getOrderedSearchResultData, selectSelectedCities, selectSelectedOrganizationIds],
  (unitData, cities, orgIds) => getCityAndOrgFilteredData(unitData, cities, orgIds),
);
