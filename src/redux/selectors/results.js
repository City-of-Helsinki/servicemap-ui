import { createSelector } from 'reselect';
import { filterEmptyServices, filterCities } from '../../utils/filters';
import getOrderedData from './ordering';

const isFetching = state => state.units.isFetching;
const units = state => state.units.data;
const cities = state => [
  ...state.settings.helsinki ? ['helsinki'] : [],
  ...state.settings.vantaa ? ['vantaa'] : [],
  ...state.settings.espoo ? ['espoo'] : [],
  ...state.settings.kauniainen ? ['kauniainen'] : [],
];
const settings = state => state.settings;
const userLocation = state => state.user.position.coordinates;
const customLocation = state => state.user.customPosition.coordinates;

export const getProcessedData = (state, options = {}) => createSelector(
  [units, isFetching, cities, settings, userLocation, customLocation],
  (data, isFetching, cities, settings, userLocation, customLocation) => {
    // Prevent processing data if fetch is in process
    if (isFetching) {
      return [];
    }
    let filteredData = data
      .filter(filterEmptyServices(cities));
    if (options.municipality) {
      filteredData = filteredData.filter(filterCities(options.municipality.split(',')));
    } else {
      filteredData = filteredData.filter(filterCities(cities));
    }
    const location = customLocation || userLocation;

    const orderedData = getOrderedData(filteredData, location)(state);
    return orderedData;
  },
)(state);

export default getProcessedData;
