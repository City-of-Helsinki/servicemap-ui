import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { getHighlightedDistrict, getSubdistrictServices } from '../../redux/selectors/district';
import { getSelectedUnit } from '../../redux/selectors/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import setMapRef from '../../redux/actions/map';
import { setAddressLocation } from '../../redux/actions/address';
import { findUserLocation } from '../../redux/actions/user';
import MapView from './MapView';
import { getServiceUnits } from '../../redux/selectors/service';
import { getProcessedMapData } from '../../redux/selectors/results';
import { markerClusterConnector, renderMarkerConnector } from './utils/unitMarkers';
import { getAddressNavigatorParamsConnector } from '../../utils/address';
import { generatePath } from '../../utils/path';
import { calculateDistance, getCurrentlyUsedPosition } from '../../redux/selectors/unit';
import { formatDistanceObject } from '../../utils';

// Get redux states as props to component
const mapStateToProps = (state, props) => {
  const {
    intl,
  } = props;
  const {
    address, navigator, settings, user,
  } = state;
  const unitList = getProcessedMapData(state);
  const unitsLoading = state.service.isFetching;
  const serviceUnits = getServiceUnits(state);
  // const serviceUnits = state.service.data;
  const highlightedDistrict = getHighlightedDistrict(state);
  const highlightedUnit = getSelectedUnit(state);
  const {
    customPosition, locale, page, position, theme,
  } = user;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { adminDistricts, units, toRender } = address;
  const districtUnits = getSubdistrictServices(state);
  const getAddressNavigatorParams = () => getAddressNavigatorParamsConnector(getLocaleText, locale);
  const getPath = (id, data) => generatePath(id, locale, data);
  const distanceCoordinates = getCurrentlyUsedPosition(state);
  const userLocation = customPosition.coordinates || position.coordinates;
  const getDistance = unit => formatDistanceObject(intl, calculateDistance(state)(unit));
  return {
    addressUnits: units,
    addressToRender: toRender,
    adminDistricts,
    createMarkerClusterLayer: markerClusterConnector(
      navigator,
      settings,
      getLocaleText,
      getDistance,
    ),
    distanceCoordinates,
    renderUnitMarkers: renderMarkerConnector(
      getLocaleText,
      navigator,
      theme,
      getPath,
      getDistance,
    ),
    highlightedDistrict,
    highlightedUnit,
    getAddressNavigatorParams,
    getLocaleText,
    unitList,
    serviceUnits,
    districtUnits,
    unitsLoading,
    currentPage: page,
    userLocation,
    hideUserMarker: customPosition.hideMarker,
    settings,
    navigator,
    locale,
  };
};

export default withRouter(injectIntl(connect(
  mapStateToProps,
  { setMapRef, setAddressLocation, findUserLocation },
)(MapView)));
