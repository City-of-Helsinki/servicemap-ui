import { connect } from 'react-redux';
import SearchView from './SearchView';
import { fetchUnits } from '../../redux/actions/unit';
import fetchSearchResults from '../../redux/actions/search';
import fetchRedirectService from '../../redux/actions/redirectService';
import { changeSelectedUnit } from '../../redux/actions/selectedUnit';
import { getOrderedData } from '../../redux/selectors/results';
import { getLocaleString } from '../../redux/selectors/locale';
import { getAddressNavigatorParamsConnector } from '../../utils/address';
import SettingsUtility from '../../utils/settings';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    mapRef, searchResults, user, settings, serviceTree, redirectService,
  } = state;
  const map = mapRef && mapRef.leafletElement;
  const {
    isFetching, count, max, previousSearch,
  } = searchResults;
  const isRedirectFetching = redirectService.isFetching;
  const resultData = getOrderedData(state);
  /* TODO: use custom hook for getAddressNavigatorParams to prevent
  re-rendering on every state change */
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getAddressNavigatorParams = address => getAddressNavigatorParamsConnector(getLocaleText, user.locale, address);

  return {
    unit: state.unit,
    searchResults: resultData,
    searchReducer: searchResults,
    isFetching,
    isRedirectFetching,
    count,
    citySettings: SettingsUtility.getActiveCitySettings(state),
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
    fetchSearchResults, fetchRedirectService, changeSelectedUnit,
  },
)(SearchView);
