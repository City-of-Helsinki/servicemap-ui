import { createSelector } from 'reselect';
import config from '../../../config';
import { filterCitiesAndOrganizations } from '../../utils/filters';
import getSortingParameters from './ordering';
import orderUnits from '../../utils/orderUnits';

const getUnits = state => state.service.data;
const getSettings = state => state.settings;

export const getServiceUnits = createSelector(
  [getUnits, getSettings, getSortingParameters],
  (units, settings, sortingParameters) => {
    const cities = [];
    const organizations = [];
    config.cities.forEach(city => cities.push(...settings.cities[city] ? [city] : []));
    config.organizations.forEach(organization => (organizations.push(...settings.organizations[organization.id] ? [organization.id] : [])),);
    const filteredUnits = units.filter(filterCitiesAndOrganizations(cities, organizations, true));
    const orderedUnits = orderUnits(filteredUnits, sortingParameters);
    return orderedUnits;
  },
);

export default { getServiceUnits };
