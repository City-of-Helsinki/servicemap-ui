import { useSelector } from 'react-redux';
import { getLocaleString } from '../redux/selectors/locale';
import getSortingParameters from '../redux/selectors/ordering';
import { calculateDistance } from '../redux/selectors/unit';
import UnitHelper from './unitHelper';

export const orderUnits = (unitData, sortingParameters) => {
  const {
    usedPosition, direction, order, locale, selectedAccessibilitySettings,
  } = sortingParameters;

  let results = Array.from(unitData);

  switch (order) {
    // Accessibility
    case 'accessibility': {
      // Exclude other result types than units from accessibility sorting.
      const unitResults = results.filter(result => result.object_type === 'unit');
      const otherResults = results.filter(result => result.object_type !== 'unit');

      unitResults.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.shorcomingCount = UnitHelper.getShortcomingCount(
          element, selectedAccessibilitySettings,
        );
      });
      unitResults.sort((a, b) => {
        const aSC = a.shorcomingCount;
        const bSC = b.shorcomingCount;

        if (aSC === null || (aSC === null && bSC === null)) return 1;
        if (bSC === null) return -1;
        if (aSC > bSC) return 1;
        if (aSC < bSC) return -1;
        return 0;
      });

      // Combine split arrays back together
      results = [...unitResults, ...otherResults];
      break;
    }
    // Alphabetical ordering
    case 'alphabetical': {
      // Exclude addressess from alphabetical ordering (addresses should only use the default order)
      const addressResults = results.filter(result => result.object_type === 'address');
      const otherResults = results.filter(result => result.object_type !== 'address');

      otherResults.sort((a, b) => {
        if (a.object_type === 'address' || b.object_type === 'address') return 0;
        const x = getLocaleString(locale, a.name).toLowerCase();
        const y = getLocaleString(locale, b.name).toLowerCase();
        if (x > y) { return -1; }
        if (x < y) { return 1; }
        return 0;
      });

      // If reversed alphabetical ordering
      if (direction === 'desc') {
        otherResults.reverse();
      }

      // Combine split arrays back together
      results = [...otherResults, ...addressResults];
      break;
    }
    case 'distance': {
      const unitsWithoutLocation = results.filter(unit => unit.location === null);
      const filteredList = results.filter(unit => unit.location !== null);
      filteredList.sort((a, b) => {
        const aDistance = calculateDistance(a, usedPosition);
        const bDistance = calculateDistance(b, usedPosition);
        if (aDistance < bDistance) return -1;
        if (aDistance > bDistance) return 1;
        return 0;
      });

      results = [...filteredList, ...unitsWithoutLocation];
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

export const applySortingParams = (unitData) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sortingParameters = useSelector(getSortingParameters);
  return orderUnits(unitData, sortingParameters);
};
