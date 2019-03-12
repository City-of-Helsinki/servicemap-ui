import { combineReducers } from 'redux';
import mapType from './views/Map/redux/reducers';
import units from './redux/reducers/unit';
import filters from './redux/reducers/filter';

// Export all redux reducers here
export default combineReducers({
  mapType,
  units,
  filters,
});
