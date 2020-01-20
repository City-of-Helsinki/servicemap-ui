import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
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
  const { locale } = state.user;
  return {
    createMarkerClusterLayer: markerClusterConnector(settings, getLocaleText, navigator),
    renderUnitMarkers: renderMarkerConnector(settings, getLocaleText, navigator),
    highlightedDistrict,
    highlightedUnit,
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

export default injectIntl(connect(
  mapStateToProps,
  { setMapRef, setAddressLocation, findUserLocation },
)(MapView));
