import { combineReducers } from 'redux';
import { mapType, mapRef } from './redux/reducers/map';
import breadcrumb from './redux/reducers/breadcrumb';
import navigator from './redux/reducers/navigator';
import { units, service, selectedUnit } from './redux/reducers/fetchDataReducer';
import user from './redux/reducers/user';
import districts from './redux/reducers/district';
import event from './redux/reducers/event';
import address from './redux/reducers/address';
import {
  colorblind, hearingAid, mobility, visuallyImpaired,
} from './redux/reducers/settings';
import {
  direction, order,
} from './redux/reducers/sort';

// Export all redux reducers here
export default combineReducers({
  breadcrumb,
  mapType,
  mapRef,
  navigator,
  units,
  user,
  districts,
  service,
  selectedUnit,
  event,
  address,
  settings: combineReducers({
    colorblind,
    hearingAid,
    mobility,
    visuallyImpaired,
  }),
  sort: combineReducers({
    direction,
    order,
  }),
});
