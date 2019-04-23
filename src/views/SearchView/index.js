import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const { units } = state;
  const {
    data, isFetching, count, max, previousSearch,
  } = units;
  return {
    unit: state.unit,
    units: data,
    isFetching,
    count,
    max,
    previousSearch,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnits, changeSelectedUnit },
)(SearchView);
