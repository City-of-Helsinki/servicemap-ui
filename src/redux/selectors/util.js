import { createSelector } from 'reselect';

import { arraysEqual } from '../../utils';

/**
 * Create selector with memoize definition for arrays. Useful when Array.filter or Array.map is used
 * in combiner.
 */
export function createMemoizedArraySelector(selectors, combiner) {
  return createSelector(selectors, combiner, {
    memoizeOptions: {
      // Check for equal array content, assume non-nil and sorted arrays
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  });
}
