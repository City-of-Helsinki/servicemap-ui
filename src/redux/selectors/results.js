import { createSelector } from 'reselect';
import { getLocaleString } from './locale';


const units = state => state.units.data;
const direction = state => state.sort.direction;
const order = state => state.sort.order;
const locale = state => state.user.locale;
const filters = state => state.units.filters;

export const getOrderedData = createSelector(
  [units, direction, order, locale, filters],
  (data, direction, order, locale, filters) => {
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

    if (filters && filters.service && filters.service.length) {
      let filteredServices = results;
      const services = filters.service;
      services.forEach((filterService) => {
        const { id } = filterService;
        filteredServices = filteredServices.filter(
          result => result
          && result.services
          && result.services.some(service => service === id),
        );
      });
      return filteredServices;
    }

    return results;
  },
);

export default {
  getOrderedData,
};
