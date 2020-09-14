import { createSelector } from 'reselect';
import { getCurrentlyUsedPosition } from './unit';

const direction = state => state.sort.direction;
const order = state => state.sort.order;
const locale = state => state.user.locale;
const settings = state => state.settings;

// Get parameters that are used in sorting units.
const getSortingParameters = createSelector(
  [getCurrentlyUsedPosition, direction, order, locale, settings],
  (usedPosition, direction, order, locale, settings) => (
    {
      usedPosition, direction, order, locale, settings,
    }
  ),
);

export default getSortingParameters;
