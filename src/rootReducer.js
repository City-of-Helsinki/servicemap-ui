import { combineReducers } from 'redux';
import breadcrumb from './redux/reducers/breadcrumb';
import navigator from './redux/reducers/navigator';
import { units, service, selectedUnit } from './redux/reducers/fetchDataReducer';
import user from './redux/reducers/user';
import districts from './redux/reducers/district';
import event from './redux/reducers/event';
import address from './redux/reducers/address';
import {
  colorblind, hearingAid, mobility, visuallyImpaired, mapType,
} from './redux/reducers/settings';
import {
  direction, order, mapRef,
} from './redux/reducers/simpleReducers';

// Export all redux reducers here
export default combineReducers({
  breadcrumb,
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
    mapType,
  }),
  sort: combineReducers({
    direction,
    order,
  }),
});
