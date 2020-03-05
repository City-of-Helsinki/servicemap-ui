import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import getHighlightedDistrict from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import setMapRef from '../../redux/actions/map';
import { setAddressLocation } from '../../redux/actions/address';
import { findUserLocation } from '../../redux/actions/user';
import MapView from './MapView';
import { getServiceUnits } from '../../redux/selectors/service';
import { getProcessedData } from '../../redux/selectors/results';
import { markerClusterConnector, renderMarkerConnector } from './utils/unitMarkers';
import { getAddressNavigatorParamsConnector } from '../../utils/address';
import { generatePath } from '../../utils/path';

// Get redux states as props to component
const mapStateToProps = (state) => {
  const { settings } = state;
  const unitList = getProcessedData(state);
  const unitsLoading = state.service.isFetching;
  const serviceUnits = getServiceUnits(state);
  // const serviceUnits = state.service.data;
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const currentPage = state.user.page;
  const userLocation = state.user.position.coordinates;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  const { addressUnits } = state.address;
  const { locale, theme } = state.user;
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, locale);
  const getPath = (id, data) => generatePath(id, locale, data);
  return {
    createMarkerClusterLayer: markerClusterConnector(
      navigator,
      settings,
      userLocation,
      getLocaleText,
    ),
    renderUnitMarkers: renderMarkerConnector(
      settings,
      userLocation,
      getLocaleText,
      navigator,
      theme,
      getPath,
    ),
    highlightedDistrict,
    highlightedUnit,
    getAddressNavigatorParams,
    getLocaleText,
    unitList,
    serviceUnits,
    unitsLoading,
    currentPage,
    userLocation,
    settings,
    navigator,
    addressUnits,
    locale,
  };
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { setMapRef, setAddressLocation, findUserLocation },
)(MapView)));
