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

export const getServiceUnits = state => createSelector(
  [units, cities],
  (units, cities) => {
    const filteredUnits = units.filter(filterCities(cities, true));
    const orderedUnits = getOrderedData(filteredUnits)(state);
    return orderedUnits;
  },
)(state);

export default { getServiceUnits };
