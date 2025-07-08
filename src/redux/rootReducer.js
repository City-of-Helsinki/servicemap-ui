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
  bounds,
  direction,
  mapRef,
  measuringMode,
  order,
} from './reducers/simpleReducers';
import statisticalDistrict from './reducers/statisticalDistrict';
import tracker from './reducers/tracker';
import user from './reducers/user';

// Export all redux reducers here
export default combineReducers({
  address,
  alerts: combineReducers({
    errors: alertErrors,
    news: alertNews,
  }),
  breadcrumb,
  bounds,
  districts,
  event,
  mapRef,
  measuringMode,
  mobilityTree,
  navigator,
  redirectService,
  searchResults,
  selectedUnit: combineReducers({
    accessibilitySentences,
    unit: selectedUnit,
    reservations,
    events: unitEvents,
    hearingMaps,
  }),
  service,
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
  tracker,
  user,
});
