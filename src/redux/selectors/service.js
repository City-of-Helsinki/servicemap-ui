import { filterCitiesAndOrganizations } from '../../utils/filters';
import orderUnits from '../../utils/orderUnits';
import getSortingParameters from './ordering';
import { selectSelectedCities, selectSelectedOrganizations } from './settings';
import { createMemoizedArraySelector } from './util';

const getUnits = state => state.service.data;
export const selectServiceCurrent = state => state.service.current;
export const selectServiceDataSet = state => state.service;
export const selectServiceIsFetching = state => state.service.isFetching;

/*
 * Service units filtered by municipalities and organizations. Also sorted.
 */
export const getServiceUnits = createMemoizedArraySelector(
  [getUnits, selectSelectedCities, selectSelectedOrganizations, getSortingParameters],
  (units, cities, organizations, sortingParameters) => {
    const organizationIds = organizations.map(o => o.id);
    const filter = filterCitiesAndOrganizations(cities, organizationIds, true);
    const filteredUnits = units.filter(filter);
    return orderUnits(filteredUnits, sortingParameters);
  },
);
