import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getProcessedData } from '../../redux/selectors/results';
import { getLocaleString } from '../../redux/selectors/locale';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const {
    units, settings, serviceTree, navigator,
  } = state;
  const {
    isFetching, count, max, previousSearch,
  } = units;
  const unitData = getProcessedData(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    unit: state.unit,
    units: unitData,
    isFetching,
    count,
    getLocaleText,
    max,
    map,
    previousSearch,
    settings,
    serviceTree,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUnits, changeSelectedUnit,
  },
)(SearchView);
