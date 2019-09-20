import { createSelector } from 'reselect';
import { getLocaleString } from './locale';
import { filterEmptyServices, filterCities } from '../../utils/filters';

const isFetching = state => state.units.isFetching;
const units = state => state.units.data;
const direction = state => state.sort.direction;
const order = state => state.sort.order;
const locale = state => state.user.locale;
const cities = state => [
  ...state.settings.helsinki ? ['helsinki'] : [],
  ...state.settings.vantaa ? ['vantaa'] : [],
  ...state.settings.espoo ? ['espoo'] : [],
  ...state.settings.kauniainen ? ['kauniainen'] : [],
];

const getOrderedData = (data, direction, order, locale) => {
  if (!data) {
    throw new Error('Invalid data provided to getOrderedData selector');
  }
  const results = Array.from(data);

  switch (order) {
    // Alphabetical ordering
    case 'alphabetical': {
      results.sort((a, b) => {
        const x = getLocaleString(locale, a.name).toLowerCase();
        const y = getLocaleString(locale, b.name).toLowerCase();
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
      });

      // If reversed alphabetical ordering
      if (direction === 'desc') {
        results.reverse();
      }
      break;
    }
    // Ordering based on match score
    case 'match': {
      // Using sort_index with assumption that default sort from API is relevance
      results.sort((a, b) => (direction === 'asc' ? b.sort_index - a.sort_index : a.sort_index - b.sort_index));
      break;
    }
    default:
  }

  return results;
};

export const getProcessedData = createSelector(
  [units, isFetching, direction, order, locale, cities],
  (data, isFetching, direction, order, locale, cities) => {
    // Prevent processing data if fetch is in process
    if (isFetching) {
      return [];
    }
    const filteredData = data
      .filter(filterCities(cities))
      .filter(filterEmptyServices(cities));
    const orderedData = getOrderedData(filteredData, direction, order, locale);
    return orderedData;
  },
);

export default {
  getProcessedData,
};
