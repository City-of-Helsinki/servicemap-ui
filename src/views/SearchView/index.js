import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import fetchRedirectService from '../../redux/actions/redirectService';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getOrderedData } from '../../redux/selectors/results';
import { getLocaleString } from '../../redux/selectors/locale';
import { getAddressNavigatorParamsConnector } from '../../utils/address';

// Listen to redux state
const mapStateToProps = (state) => {
  const map = state.mapRef.leafletElement;
  const {
    units, user, settings, serviceTree, redirectService,
  } = state;
  const {
    isFetching, count, max, previousSearch,
  } = units;
  const isRedirectFetching = redirectService.isFetching;
  const unitData = getOrderedData(state);
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);

  return {
    unit: state.unit,
    units: unitData,
    unitsReducer: units,
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
