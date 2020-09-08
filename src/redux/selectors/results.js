import { createSelector } from 'reselect';
import { filterEmptyServices, filterCities } from '../../utils/filters';
import getOrderedData from './ordering';
import { isEmbed } from '../../utils/path';
import config from '../../../config';

const isFetching = state => state.units.isFetching;
const units = state => state.units.data;
const cities = (state) => {
  const cities = [];
  config.cities.forEach((city) => {
    cities.push(...state.settings.cities[city] ? [city] : []);
  });
  return cities;
};

/**
 * Returns given data after filtering it
 * @param {*} data - search data to be filtered
 * @param {*} options - options for filtering - municipality: to override city setting filtering
 */
const getFilteredData = (data, options = {}) => createSelector(
  [cities],
  (cities) => {
    let embed = false;
    if (global.window) {
      embed = isEmbed({ url: window.location });
    }
    let filteredData = data
      .filter(filterEmptyServices(cities));
    if (!embed) {
      if (options.municipality) {
        filteredData = filteredData.filter(filterCities(options.municipality.split(',')));
      } else {
        filteredData = filteredData.filter(filterCities(cities));
      }
    }
    return filteredData;
  },
);

/**
 * Gets processed data for rendering search results
 * @param {*} state - redux state object
 * @param {*} options - options for filtering
 */
export const getProcessedData = (state, options = {}) => createSelector(
  [units, isFetching],
  (data, isFetching) => {
    // Prevent processing data if fetch is in process
    if (isFetching) {
      return [];
    }

    const filteredData = getFilteredData(data, options)(state);
    const orderedData = getOrderedData(filteredData)(state);

    return orderedData;
  },
)(state);

/**
 * Get processed data for map rendering
 * @param {*} state - redux state object
 * @param {*} options - options for filtering
 */
export const getProcessedMapData = (state, options = {}) => createSelector(
  [units, isFetching],
  (data, isFetching) => {
    // Prevent processing data if fetch is in process
    if (isFetching) {
      return [];
    }

    const filteredData = getFilteredData(data, options)(state);

    return filteredData;
  },
)(state);
