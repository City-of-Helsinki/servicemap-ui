import UnitHelper from './unitHelper';
import { getLocaleString } from '../redux/selectors/locale';
import { calculateDistance } from '../redux/selectors/unit';

const orderUnits = (unitData, sortingParameters) => {
  const {
    usedPosition, direction, order, locale, settings,
  } = sortingParameters;

  let results = Array.from(unitData);

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
      const unitsWithoutLocation = results.filter(unit => unit.location === null);
      const filteredLsit = results.filter(unit => unit.location !== null);
      filteredLsit.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.distanceFromUser = calculateDistance(element, usedPosition);
      });
      filteredLsit.sort((a, b) => {
        const aDistance = a.distanceFromUser;
        const bDistance = b.distanceFromUser;
        if (aDistance < bDistance) return -1;
        if (aDistance > bDistance) return 1;
        return 0;
      });

      // If reversed distance ordering
      if (direction === 'desc') {
        filteredLsit.reverse();
      }

      results = [...filteredLsit, ...unitsWithoutLocation];
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

export default orderUnits;
