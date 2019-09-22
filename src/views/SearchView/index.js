import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getProcessedData } from '../../redux/selectors/results';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const { units, settings, serviceTree } = state;
  const {
    isFetching, count, max, previousSearch,
  } = units;
  const unitData = getProcessedData(state);

  return {
    unit: state.unit,
    units: unitData,
    isFetching,
    count,
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
