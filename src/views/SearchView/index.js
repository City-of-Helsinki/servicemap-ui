import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/filter';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const { units } = state;
  const {
    data, isFetching, count, max,
  } = units;
  return {
    unit: state.unit,
    units: data,
    isFetching,
    count,
    max,
    map,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnits, changeSelectedUnit },
)(SearchView);
