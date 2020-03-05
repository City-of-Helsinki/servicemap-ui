import { createSelector } from 'reselect';
import { filterCities } from '../../utils/filters';
import getOrderedData from './ordering';


const units = state => state.service.data;
const cities = state => [
  ...state.settings.helsinki ? ['helsinki'] : [],
  ...state.settings.vantaa ? ['vantaa'] : [],
  ...state.settings.espoo ? ['espoo'] : [],
  ...state.settings.kauniainen ? ['kauniainen'] : [],
];
const userLocation = state => state.user.position.coordinates;
const customLocation = state => state.user.customPosition.coordinates;

export const getServiceUnits = state => createSelector(
  [units, cities, userLocation, customLocation],
  (units, cities, userLocation, customLocation) => {
    const filteredUnits = units.filter(filterCities(cities, true));
    const location = customLocation || userLocation || null;
    const orderedUnits = getOrderedData(filteredUnits, location)(state);
    return orderedUnits;
  },
)(state);

export default { getServiceUnits };
