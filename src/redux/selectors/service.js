import { createSelector } from 'reselect';
import { filterCities } from '../../utils/filters';
import getOrderedData from './ordering';
import config from '../../../config';


const units = state => state.service.data;
const cities = (state) => {
  const cities = [];
  config.cities.forEach(city => cities.push(...state.settings.cities[city] ? [city] : []));
  return cities;
};

export const getServiceUnits = state => createSelector(
  [units, cities],
  (units, cities) => {
    const filteredUnits = units.filter(filterCities(cities, true));
    const orderedUnits = getOrderedData(filteredUnits)(state);
    return orderedUnits;
  },
)(state);

export default { getServiceUnits };
