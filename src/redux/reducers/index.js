import { combineReducers } from 'redux'
import { units, fetchHasErrored, fetchIsLoading, filter } from './fetchUnits'

export default combineReducers({
  units,
  fetchHasErrored,
  fetchIsLoading,
  filter
})
