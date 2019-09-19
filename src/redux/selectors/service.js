import { createSelector } from 'reselect';
import { filterCities } from '../../utils/filters';


const units = state => state.service.units;
const cities = state => [
  ...state.settings.helsinki ? ['helsinki'] : [],
  ...state.settings.vantaa ? ['vantaa'] : [],
  ...state.settings.espoo ? ['espoo'] : [],
  ...state.settings.kauniainen ? ['kauniainen'] : [],
];

export const getServiceUnits = createSelector(
  [units, cities],
  (units, cities) => {
    const filteredUnits = units.filter(filterCities(cities, true));
    return filteredUnits;
  },
);

export default { getServiceUnits };
