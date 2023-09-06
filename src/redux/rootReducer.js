import { combineReducers } from 'redux';
import address from './reducers/address';
import breadcrumb from './reducers/breadcrumb';
import districts from './reducers/district';
import event from './reducers/event';
import {
  accessibilitySentences,
  alertErrors,
  alertNews,
  hearingMaps,
  redirectService,
  reservations,
  searchResults,
  selectedUnit,
  service,
  unitEvents,
} from './reducers/fetchDataReducer';
import mobilityTree from './reducers/mobilityTree';
import navigator from './reducers/navigator';
import serviceTree from './reducers/serviceTree';
import {
  cities,
  colorblind,
  hearingAid,
  mapType,
  mobility,
  organizations,
  settingsCollapsed,
  visuallyImpaired,
} from './reducers/settings';
import {
  direction,
  mapRef,
  measuringMode,
  order
} from './reducers/simpleReducers';
import statisticalDistrict from './reducers/statisticalDistrict';
import user from './reducers/user';

// Export all redux reducers here
export default combineReducers({
  alerts: combineReducers({
    errors: alertErrors,
    news: alertNews,
  }),
  breadcrumb,
  mapRef,
  measuringMode,
  navigator,
  searchResults,
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
  mobilityTree,
  serviceTree,
  settings: combineReducers({
    colorblind,
    hearingAid,
    mobility,
    visuallyImpaired,
    cities,
    organizations,
    mapType,
    settingsCollapsed,
  }),
  sort: combineReducers({
    direction,
    order,
  }),
  statisticalDistrict,
  redirectService,
});
