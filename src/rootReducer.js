import { combineReducers } from 'redux';
import mapType from './redux/reducers/map';
import units from './redux/reducers/unit';
import filters from './redux/reducers/filter';
import locale from './redux/reducers/locale';

// Export all redux reducers here
export default combineReducers({
  mapType,
  units,
  filters,
  locale,
});
