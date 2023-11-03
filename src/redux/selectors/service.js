import { createSelector } from 'reselect';
import { filterCitiesAndOrganizations } from '../../utils/filters';
import getSortingParameters from './ordering';
import orderUnits from '../../utils/orderUnits';
import { selectSelectedCities, selectSelectedOrganizations } from './settings';

const getUnits = state => state.service.data;

export const getServiceUnits = createSelector(
  [getUnits, selectSelectedCities, selectSelectedOrganizations, getSortingParameters],
  (units, cities, organizations, sortingParameters) => {
    const filter = filterCitiesAndOrganizations(cities, organizations.map(o => o.id), true);
    const filteredUnits = units.filter(filter);
    return orderUnits(filteredUnits, sortingParameters);
  },
);

export default { getServiceUnits };
