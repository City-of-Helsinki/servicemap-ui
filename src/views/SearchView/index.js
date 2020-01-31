import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import fetchRedirectService from '../../redux/actions/redirectService';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getProcessedData } from '../../redux/selectors/results';
import isClient from '../../utils';
import { getLocaleString } from '../../redux/selectors/locale';
import { getAddressNavigatorParamsConnector } from '../../utils/address';

// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const {
    units, user, settings, serviceTree, redirectService,
  } = state;
  const {
    isFetching, count, max, previousSearch,
  } = units;
  const isRedirectFetching = redirectService.isFetching;
  const options = {};
  const municipality = isClient() && new URLSearchParams().get('municipality');
  if (municipality) {
    options.municipality = municipality;
  }
  const unitData = getProcessedData(state, options);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);

  return {
    unit: state.unit,
    units: unitData,
    isFetching,
    isRedirectFetching,
    count,
    getAddressNavigatorParams,
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
    fetchUnits, fetchRedirectService, changeSelectedUnit,
  },
)(SearchView);
