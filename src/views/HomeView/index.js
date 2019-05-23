import { connect } from 'react-redux';
import HomeView from './HomeView';
import { fetchUnits } from '../../redux/actions/unit';
import { setCurrentPage } from '../../redux/actions/user';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const { units, navigator } = state;
  const {
    data, isFetching, count, max,
  } = units;
  return {
    unit: state.unit,
    units: data,
    isFetching,
    count,
    max,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  { fetchUnits, setCurrentPage },
)(HomeView);
