import { combineReducers } from 'redux';
import {
  units, fetchHasErrored, fetchIsLoading, filter,
} from './fetchUnits';
import mapType from './mapType';

export default combineReducers({
  units,
  fetchHasErrored,
  fetchIsLoading,
  filter,
  mapType,
});
