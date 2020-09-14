import { createSelector } from 'reselect';
import config from '../../../config';
import { filterCities } from '../../utils/filters';
import getSortingParameters from './ordering';
import orderUnits from '../../utils/orderUnits';


const getUnits = state => state.service.data;
const getSettings = state => state.settings;

export const getServiceUnits = createSelector(
  [getUnits, getSettings, getSortingParameters],
  (units, settings, sortingParameters) => {
    const cities = [];
    config.cities.forEach(city => cities.push(...settings.cities[city] ? [city] : []));
    const filteredUnits = units.filter(filterCities(cities, true));
    const orderedUnits = orderUnits(filteredUnits, sortingParameters);
    return orderedUnits;
  },
);

export default { getServiceUnits };
