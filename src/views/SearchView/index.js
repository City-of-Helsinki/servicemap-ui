import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits, setNewSearchData } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { setCurrentPage } from '../../redux/actions/user';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
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
    map,
    previousSearch,
  };
};

export default connect(
  mapStateToProps,
  {
    fetchUnits, changeSelectedUnit, setCurrentPage, setNewSearchData,
  },
)(SearchView);
