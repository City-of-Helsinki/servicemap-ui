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

export const getProcessedData = (state, options = {}) => createSelector(
  [units, isFetching, cities],
  (data, isFetching, cities) => {
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

    const orderedData = getOrderedData(filteredData)(state);
    return orderedData;
  },
)(state);

export default getProcessedData;
