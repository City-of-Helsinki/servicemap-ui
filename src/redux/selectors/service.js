import { createSelector } from 'reselect';
import { arraysEqual } from '../../utils';
import { filterCitiesAndOrganizations } from '../../utils/filters';
import orderUnits from '../../utils/orderUnits';
import getSortingParameters from './ordering';
import { selectSelectedCities, selectSelectedOrganizations } from './settings';

const getUnits = state => state.service.data;
export const selectServiceCurrent = state => state.service.current;
export const selectServiceDataSet = state => state.service;

export const getServiceUnits = createSelector(
  [getUnits, selectSelectedCities, selectSelectedOrganizations, getSortingParameters],
  (units, cities, organizations, sortingParameters) => {
    const organizationIds = organizations.map(o => o.id);
    const filter = filterCitiesAndOrganizations(cities, organizationIds, true);
    const filteredUnits = units.filter(filter);
    return orderUnits(filteredUnits, sortingParameters);
  },
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);
