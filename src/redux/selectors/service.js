import { createSelector } from 'reselect';
import { filterCities } from '../../utils/filters';
import getSortingParameters from './ordering';
import orderUnits from '../../utils/orderUnits';


const getUnits = state => state.service.data;
const getSettings = state => state.settings;

export const getServiceUnits = createSelector(
  [getUnits, getSettings, getSortingParameters],
  (units, settings, sortingParameters) => {
    const cities = [
      ...settings.helsinki ? ['helsinki'] : [],
      ...settings.vantaa ? ['vantaa'] : [],
      ...settings.espoo ? ['espoo'] : [],
      ...settings.kauniainen ? ['kauniainen'] : [],
    ];
    const filteredUnits = units.filter(filterCities(cities, true));
    const orderedUnits = orderUnits(filteredUnits, sortingParameters);
    return orderedUnits;
  },
);

export default { getServiceUnits };
