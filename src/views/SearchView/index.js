import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getProcessedData } from '../../redux/selectors/results';
import isClient from '../../utils';
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
  const options = {};
  const municipality = isClient() && new URLSearchParams().get('municipality');
  if (municipality) {
    options.municipality = municipality;
  }
  const unitData = getProcessedData(state, options);
  const getLocaleText = textObject => getLocaleString(state, textObject);

  return {
    unit: state.unit,
    units: unitData,
    isFetching,
    count,
    getLocaleText,
    max,
    map,
    navigator,
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
