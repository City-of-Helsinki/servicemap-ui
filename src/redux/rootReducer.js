import { combineReducers } from 'redux';
import breadcrumb from './reducers/breadcrumb';
import navigator from './reducers/navigator';
import {
  units,
  service,
  selectedUnit,
  accessibilitySentences,
  redirectService,
  reservations,
  unitEvents,
  hearingMaps,
} from './reducers/fetchDataReducer';
import user from './reducers/user';
import districts from './reducers/district';
import event from './reducers/event';
import address from './reducers/address';
import serviceTree from './reducers/serviceTree';
import {
  colorblind, hearingAid, mobility, mapType, visuallyImpaired, helsinki, espoo, vantaa, kauniainen,
} from './reducers/settings';
import {
  direction, order, mapRef, settingsToggled,
} from './reducers/simpleReducers';

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
    events: unitEvents,
    hearingMaps,
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
  redirectService,
});
