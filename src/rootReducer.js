import { combineReducers } from 'redux';
import breadcrumb from './redux/reducers/breadcrumb';
import navigator from './redux/reducers/navigator';
import {
  units, service, selectedUnit, accessibilitySentences, reservations,
} from './redux/reducers/fetchDataReducer';
import user from './redux/reducers/user';
import districts from './redux/reducers/district';
import event from './redux/reducers/event';
import address from './redux/reducers/address';
import serviceTree from './redux/reducers/serviceTree';
import {
  colorblind, hearingAid, mobility, mapType, visuallyImpaired, helsinki, espoo, vantaa, kauniainen,
} from './redux/reducers/settings';
import {
  direction, order, mapRef, settingsToggled,
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
  selectedUnit: combineReducers({
    accessibilitySentences,
    unit: selectedUnit,
    reservations,
  }),
  event,
  address,
  serviceTree,
  settings: combineReducers({
    toggled: settingsToggled,
    colorblind,
    hearingAid,
    mobility,
    visuallyImpaired,
    helsinki,
    espoo,
    vantaa,
    kauniainen,
    mapType,
  }),
  sort: combineReducers({
    direction,
    order,
  }),
});
