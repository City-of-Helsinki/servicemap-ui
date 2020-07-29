import { createSelector } from 'reselect';
import { getLocaleString } from './locale';
import UnitHelper from '../../utils/unitHelper';
import { calculateDistance } from './unit';

const direction = state => state.sort.direction;
const order = state => state.sort.order;
const locale = state => state.user.locale;
const settings = state => state.settings;
// Return function that accepts unit as parameter
const calculateDistanceFunc = state => calculateDistance(state);

const getOrderedData = data => createSelector(
  [calculateDistanceFunc, direction, order, locale, settings],
  (calculateDistanceFunc, direction, order, locale, settings) => {
    if (!data) {
      throw new Error('Invalid data provided to getOrderedData selector');
    }
    const results = Array.from(data);

    switch (order) {
    // Accessibility
      case 'accessibility': {
        results.forEach((element) => {
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
          const x = getLocaleString(locale, a.name || a.street.name).toLowerCase();
          const y = getLocaleString(locale, b.name || b.street.name).toLowerCase();
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
          element.distanceFromUser = calculateDistanceFunc(element);
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
  },
);

export default getOrderedData;
