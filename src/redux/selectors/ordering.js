import { createSelector } from 'reselect';
import { selectSelectedAccessibilitySettings } from './settings';
import { getCurrentlyUsedPosition } from './unit';

const direction = state => state.sort.direction;
const order = state => state.sort.order;
const locale = state => state.user.locale;

// Get parameters that are used in sorting units.
const getSortingParameters = createSelector(
  [getCurrentlyUsedPosition, direction, order, locale, selectSelectedAccessibilitySettings],
  (usedPosition, direction, order, locale, selectedAccessibilitySettings) => (
    {
      usedPosition, direction, order, locale, selectedAccessibilitySettings,
    }
  ),
);

export default getSortingParameters;
