import { combineReducers } from 'redux';
import mapType from './redux/reducers/map';
import units from './redux/reducers/unit';
import filters from './redux/reducers/filter';
import locale from './redux/reducers/locale';
import districts from './redux/reducers/district';
import service from './redux/reducers/services';
import selectedUnit from './redux/reducers/selectedUnit';

// Export all redux reducers here
export default combineReducers({
  mapType,
  units,
  filters,
  locale,
  districts,
  service,
  selectedUnit,
});
