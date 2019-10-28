import { createSelector } from 'reselect';
import { getLocaleString } from './locale';
import { filterEmptyServices, filterCities } from '../../utils/filters';
import UnitHelper from '../../utils/unitHelper';
import calculateDistance from '../../utils/calculateDistance';

const isFetching = state => state.units.isFetching;
const units = state => state.units.data;
const direction = state => state.sort.direction;
const order = state => state.sort.order;
const locale = state => state.user.locale;
const settings = state => state.settings;
const userLocation = state => state.user.position;

const getOrderedData = (data, direction, order, locale, settings, userLocation) => {
  if (!data) {
    throw new Error('Invalid data provided to getOrderedData selector');
  }
  const results = Array.from(data);

  switch (order) {
    // Accessibility
    case 'accessibility': {
      results.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.shorcomingCount = UnitHelper.getShortcomingCount(element, settings);
      });
      results.sort((a, b) => {
        if (a.object_type !== 'unit' || b.object_type !== 'unit') {
          return 0;
        }
        const aSC = a.shorcomingCount;
        const bSC = b.shorcomingCount;

        if (aSC === null || (aSC === null && bSC === null)) { return -1; }
        if (bSC === null) { return 1; }
        if (aSC > bSC) { return -1; }
        if (aSC < bSC) { return 1; }
        return 0;
      });

      // If reversed alphabetical ordering
      if (direction === 'desc') {
        results.reverse();
      }
      break;
    }
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
    case 'distance': {
      results.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.distanceFromUser = calculateDistance(element, userLocation);
      });
      results.sort((a, b) => {
        const aDistance = a.distanceFromUser;
        const bDistance = b.distanceFromUser;
        if (aDistance < bDistance) return -1;
        if (aDistance > bDistance) return 1;
        return 0;
      });

      // If reversed distance ordering
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
  [units, isFetching, direction, order, locale, settings, userLocation],
  (data, isFetching, direction, order, locale, settings, userLocation) => {
    // Prevent processing data if fetch is in process
    if (isFetching) {
      return [];
    }
    const cities = [
      ...settings.helsinki ? ['helsinki'] : [],
      ...settings.vantaa ? ['vantaa'] : [],
      ...settings.espoo ? ['espoo'] : [],
      ...settings.kauniainen ? ['kauniainen'] : [],
    ];
    const filteredData = data
      .filter(filterCities(cities))
      .filter(filterEmptyServices(cities));
    const orderedData = getOrderedData(filteredData, direction, order, locale, settings, userLocation);
    return orderedData;
  },
);

export default {
  getProcessedData,
};
