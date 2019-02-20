import { createSelector } from 'reselect'

// Returns loading state, used for fetch
export const getLoadingState = store => store.fetchIsLoading

// Returns error, used for fetch
export const getErrorState = store => store.fetchHasErrored

const getUnits = store => store.units

const getFilters = store => store.filter

// This returns units filtered with city filter, through Redux reselect
export const getUnitsState = createSelector(
  [getUnits, getFilters],
  (units, filters) => {
    if (units && filters) {
      return units.filter(unit => unit[filters.filter] === filters.value)
    } if (!filters) {
      return units
    }
    return []
  }
)
