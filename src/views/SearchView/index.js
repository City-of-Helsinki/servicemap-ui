import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
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
  };
};

export default connect(
  mapStateToProps,
  { fetchUnits },
)(SearchView);
