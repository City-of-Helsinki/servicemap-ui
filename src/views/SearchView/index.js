import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits, setNewFilters } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getOrderedData } from '../../redux/selectors/results';
import { getLocaleString } from '../../redux/selectors/locale';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const { units, navigator } = state;
  const {
    filters, isFetching, count, max, previousSearch,
  } = units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const unitData = getOrderedData(state);
  return {
    filters,
    unit: state.unit,
    units: unitData,
    isFetching,
    count,
    getLocaleText,
    max,
    map,
    navigator,
    previousSearch,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUnits, changeSelectedUnit, setNewFilters,
  },
)(SearchView);
