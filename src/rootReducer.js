import { combineReducers } from 'redux';
import breadcrumb from './redux/reducers/breadcrumb';
import { mapType, mapRef } from './redux/reducers/map';
import units from './redux/reducers/unit';
import user from './redux/reducers/user';
import districts from './redux/reducers/district';
import service from './redux/reducers/services';
import selectedUnit from './redux/reducers/selectedUnit';

// Export all redux reducers here
export default combineReducers({
  breadcrumb,
  mapType,
  mapRef,
  units,
  user,
  districts,
  service,
  selectedUnit,
});
