import { createSelector } from 'reselect';
import { arraysEqual } from '../../utils';
import { filterCitiesAndOrganizations } from '../../utils/filters';
import getSortingParameters from './ordering';
import orderUnits from '../../utils/orderUnits';
import { selectSelectedCities, selectSelectedOrganizations } from './settings';

const getUnits = state => state.service.data;

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

export default { getServiceUnits };
