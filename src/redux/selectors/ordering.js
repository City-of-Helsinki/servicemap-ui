import { createSelector } from 'reselect';

import { selectSelectedAccessibilitySettings } from './settings';
import { getCurrentlyUsedPosition } from './unit';
import { getLocale } from './user';

const direction = (state) => state.sort.direction;
const order = (state) => state.sort.order;

// Get parameters that are used in sorting units.
const getSortingParameters = createSelector(
  [
    getCurrentlyUsedPosition,
    direction,
    order,
    getLocale,
    selectSelectedAccessibilitySettings,
  ],
  (usedPosition, direction, order, locale, selectedAccessibilitySettings) => ({
    usedPosition,
    direction,
    order,
    locale,
    selectedAccessibilitySettings,
  })
);

export default getSortingParameters;
