import { createSelector } from 'reselect';
const getUnits = store => store.units && store.units.data;
// Filters
const getFilters = store => store.filters && store.filters.filter;
const getSelectedFilter = store => store.filters && store.filters.selected;

export const getSelectedUnit = createSelector(
  [getUnits, getSelectedFilter],
  (units, filter) => {
    if (units && filter) {
      return units.filter(unit => unit['id'] === filter)[0];
    }
    return null;
  }
)

// This returns units filtered with city filter, through Redux reselect
export const getFilteredUnits = createSelector(
  [getUnits, getFilters],
  (units, filters) => {
    if (units && filters) {
      return units.filter(unit => unit[filters.key] === filters.value);
    } if (!filters) {
      return units;
    }
    return [];
  },
);
