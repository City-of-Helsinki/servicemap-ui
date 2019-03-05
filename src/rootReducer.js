import { combineReducers } from 'redux';
import { mapType, unitList } from './views/Map/redux/reducers';

// Export all redux reducers here
export default combineReducers({
  mapType,
  unitList,
});
