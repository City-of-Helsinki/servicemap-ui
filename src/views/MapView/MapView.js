/* eslint-disable global-require */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { LocationDisabled, MyLocation } from '@mui/icons-material';
import { ButtonBase } from '@mui/material';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Loading } from '../../components';
import { setBounds } from '../../redux/actions/map';
import { selectNavigator } from '../../redux/selectors/general';
import { getSelectedUnitEvents } from '../../redux/selectors/selectedUnit';
import { selectMapType } from '../../redux/selectors/settings';
import { getLocale, getPage } from '../../redux/selectors/user';
import { parseSearchParams } from '../../utils';
import { useNavigationParams } from '../../utils/address';
import { applyCityAndOrganizationFilter } from '../../utils/filters';
import {
  coordinateIsActive,
  getBboxFromBounds,
  getCoordinatesFromUrl,
  mapHasMapPane,
  parseBboxFromLocation,
  swapCoordinates,
} from '../../utils/mapUtility';
import { isEmbed } from '../../utils/path';
import SettingsUtility from '../../utils/settings';
import AddressMarker from './components/AddressMarker';
import AddressPopup from './components/AddressPopup';
import CoordinateMarker from './components/CoordinateMarker';
import CustomControls from './components/CustomControls';
import DistanceMeasure from './components/DistanceMeasure';
import Districts from './components/Districts';
import ElevationControl from './components/ElevationControl';
import EntranceMarker from './components/EntranceMarker';
import EventMarkers from './components/EventMarkers';
import HideSidebarButton from './components/HideSidebarButton';
import MarkerCluster from './components/MarkerCluster';
import PanControl from './components/PanControl';
import SimpleStatisticalComponent from './components/StatisticalDataMapInfo';
import StatisticalDistricts from './components/StatisticalDistricts';
import TransitStops from './components/TransitStops';
import UnitGeometry from './components/UnitGeometry';
import UserMarker from './components/UserMarker';
import { mapOptions } from './config/mapConfig';
import adjustControlElements from './utils';
import CreateMap from './utils/createMap';
import fetchAddress from './utils/fetchAddress';
import {
  resolveCombinedReducerData,
  selectDistrictLoadingReducer,
  selectServiceUnitSearchResultLoadingReducer,
} from './utils/loadingReducerSelector';
import { focusToPosition, getBoundsFromBbox } from './utils/mapActions';
import MapUtility from './utils/mapUtility';
import useMapUnits from './utils/useMapUnits';

if (global.window) {
  require('leaflet');
  require('leaflet.markercluster');
  require('leaflet.heightgraph');
  global.rL = require('react-leaflet');
}

function EmbeddedActions() {
  const dispatch = useDispatch();
  const embedded = isEmbed();
  const map = useMapEvents({
    moveend() {
      const bounds = map.getBounds();
      if (embedded) {
        window.parent.postMessage({ bbox: getBboxFromBounds(bounds) });
      } else {
        dispatch(setBounds(bounds));
      }
    },
  });

  return null;
}

function MapView(props) {
  const {
    location,
    hideUserMarker = false,
    highlightedUnit = null,
    highlightedDistrict = null,
    isMobile = false,
    setMapRef,
    findUserLocation,
    userLocation = null,
    measuringMode,
    toggleSidebar = null,
    sidebarHidden = false,
    disableInteraction = false,
  } = props;

  // State
  const [mapObject, setMapObject] = useState(null);
  const [mapElement, setMapElement] = useState(null);
  const [prevMap, setPrevMap] = useState(null);
  const [mapUtility, setMapUtility] = useState(null);
  const [measuringMarkers, setMeasuringMarkers] = useState([]);
  const [measuringLine, setMeasuringLine] = useState([]);

  const theme = useTheme();
  const embedded = isEmbed({ url: location.pathname });
  const navigator = useSelector(selectNavigator);
  const mapType = useSelector(selectMapType);
  const locale = useSelector(getLocale);
  const currentPage = useSelector(getPage);
  const getAddressNavigatorParams = useNavigationParams();
  const unitData = applyCityAndOrganizationFilter(
    useMapUnits(),
    location,
    embedded
  );
  const intl = useIntl();
  const districtLoadingReducerData = useSelector(selectDistrictLoadingReducer);
  const serviceUnitSearchResultReducerData = useSelector(
    selectServiceUnitSearchResultLoadingReducer
  );

  const { showLoadingScreen, loadingReducer, hideLoadingNumbers } =
    resolveCombinedReducerData(
      districtLoadingReducerData,
      serviceUnitSearchResultReducerData
    );
  // This unassigned selector is used to trigger re-render after events are fetched
  useSelector(getSelectedUnitEvents);

  const initializeMap = () => {
    // Search param map value
    const spMap = parseSearchParams(location.search).map || false;
    // old links might have "guideMap", this hopefully keeps them alive
    const mapTypeUrlParam = spMap === 'guideMap' ? 'guidemap' : spMap;
    // If embedded, then 1. url param, 2. default 'servicemap'
    // If normal mode, then 1. url param, 2. map type (local storage) 3. default 'servicemap'
    const mapType1 =
      mapTypeUrlParam ||
      (!embedded && mapType) ||
      SettingsUtility.defaultMapType;

    const newMap = CreateMap(mapType1, locale);
    setMapObject(newMap);
  };

  const mapTypeChanged = () => {
    if (mapElement) {
      // If changing map type, save current map viewport values before changing map
      const map = mapElement;
      map.defaultZoom = mapObject.options.zoom;
      setPrevMap(map);
    }
    const newMap = CreateMap(mapType, locale);
    setMapObject(newMap);
  };

  const focusOnUser = () => {
    if (userLocation) {
      focusToPosition(mapElement, [
        userLocation.longitude,
        userLocation.latitude,
      ]);
    } else if (!embedded) {
      findUserLocation();
    }
  };

  const navigateToAddress = (latLng) => {
    fetchAddress(latLng).then((data) => {
      navigator.push('address', getAddressNavigatorParams(data));
    });
  };

  useEffect(() => {
    // On map mount
    initializeMap();
    if (!embedded) {
      findUserLocation();
    }
    // Hide zoom control amd attribution from screen readers
    setTimeout(() => {
      adjustControlElements(embedded);
    }, 1);

    return () => {
      // Clear map reference on unmount
      setMapRef(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      adjustControlElements();
    }, 1);
  }, [mapObject]);

  useEffect(() => {
    if (currentPage !== 'unit' || !highlightedUnit || !mapUtility) {
      return;
    }
    mapUtility.centerMapToUnit(highlightedUnit);
  }, [highlightedUnit, mapUtility, currentPage]);

  useEffect(() => {
    // On map type change
    // Init new map and set new ref to redux
    if (!embedded) {
      // In embed mode, map type is read from url.
      mapTypeChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapType]);

  useEffect(() => {
    if (mapElement) {
      setMapUtility(new MapUtility({ leaflet: mapElement }));

      const hasLocation = coordinateIsActive(location);
      if (hasLocation) {
        try {
          const position = swapCoordinates(getCoordinatesFromUrl(location));
          focusToPosition(mapElement, position);
        } catch (e) {
          console.warn('Error while attempting to focus on coordinate:', e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapElement]);

  useEffect(() => {
    if (!measuringMode) {
      setMeasuringMarkers([]);
      setMeasuringLine([]);
    }
  }, [measuringMode]);

  const unitHasLocationAndGeometry = (un) => un?.location && un?.geometry;

  const unitHasLineStringLocationAndGeometry = (un) =>
    un?.location && un?.geometry && un?.geometry?.type === 'MultiLineString';

  // Render

  const renderUnitGeometry = () => {
    if (highlightedDistrict) return null;
    if (currentPage !== 'unit') {
      return unitData.map((unit) =>
        unit.geometry ? <UnitGeometry key={unit.id} data={unit} /> : null
      );
    }
    if (unitHasLocationAndGeometry(highlightedUnit)) {
      return <UnitGeometry data={highlightedUnit} />;
    }
    return null;
  };

  if (global.rL && mapObject) {
    const { MapContainer, TileLayer, WMSTileLayer } = global.rL || {};
    let center = mapOptions.initialPosition;
    let zoom = isMobile ? mapObject.options.mobileZoom : mapObject.options.zoom;
    // If changing map type, use viewport values of previous map
    if (prevMap && mapHasMapPane(prevMap)) {
      center = prevMap.getCenter() || prevMap.options.center;
      /* Different map types have different zoom levels
      Use the zoom difference to calculate the new zoom level */
      const zoomDifference = mapObject.options.zoom - prevMap.defaultZoom;
      zoom = prevMap.getZoom()
        ? prevMap.getZoom() + zoomDifference
        : prevMap.options.zoom + zoomDifference;
    }

    const userLocationAriaLabel = intl.formatMessage({
      id: !userLocation ? 'location.notAllowed' : 'location.center',
    });
    const eventSearch = parseSearchParams(location.search).events;
    const defaultBounds = parseBboxFromLocation(location);

    const mapClass = css({
      height: '100%',
      flex: '1 0 auto',
      '& .leaflet-bottom.leaflet-right .leaflet-control button,a': {
        '&:hover': {
          color: '#347865 !important',
        },
        '&:focused': {
          color: '#347865 !important',
        },
      },
      '&:focus': {
        margin: '4px 4px 4px 0px',
        height: 'calc(100% - 8px)',
        outline: '2px solid transparent',
        boxShadow: `0 0 0 4px ${theme.palette.focusBorder.main}`,
      },
      zIndex: theme.zIndex.forward,
    });
    const mapNoSidebarClass = css({
      '&:focus': {
        margin: 4,
      },
    });
    const locationButtonFocusClass = css({
      outline: '2px solid transparent',
      boxShadow: `0 0 0 3px ${theme.palette.primary.highContrast}, 0 0 0 4px ${theme.palette.focusBorder.main}`,
    });

    return (
      <MapContainer
        tap={false} // This should fix leaflet safari double click bug
        className={`${mapClass} ${embedded ? mapNoSidebarClass : ''} `}
        key={mapObject.options.name}
        zoomControl={false}
        bounds={getBoundsFromBbox(defaultBounds)}
        doubleClickZoom={false}
        crs={mapObject.crs}
        center={!defaultBounds ? center : null}
        zoom={zoom}
        minZoom={mapObject.options.minZoom}
        maxZoom={mapObject.options.maxZoom}
        unitZoom={mapObject.options.unitZoom}
        detailZoom={mapObject.options.detailZoom}
        maxBounds={mapObject.options.mapBounds || mapOptions.defaultMaxBounds}
        maxBoundsViscosity={1.0}
        ref={(map) => {
          setMapElement(map);
          setMapRef(map);
        }}
      >
        {eventSearch ? (
          <EventMarkers searchData={unitData} />
        ) : (
          <MarkerCluster
            data={unitData}
            measuringMode={measuringMode}
            disableInteraction={disableInteraction}
          />
        )}
        {renderUnitGeometry()}
        {mapObject.options.name === 'ortographic' &&
        mapObject.options.wmsUrl !== 'undefined' ? (
          // Use WMS service for ortographic maps, because HSY's WMTS tiling does not work
          <WMSTileLayer
            url={mapObject.options.wmsUrl}
            layers={mapObject.options.wmsLayerName}
            attribution={intl.formatMessage({
              id: mapObject.options.attribution,
            })}
          />
        ) : (
          <TileLayer
            url={mapObject.options.url}
            attribution={intl.formatMessage({
              id: mapObject.options.attribution,
            })}
          />
        )}
        {showLoadingScreen ? (
          <StyledLoadingScreenContainer>
            <Loading
              reducer={loadingReducer}
              hideNumbers={hideLoadingNumbers}
            />
          </StyledLoadingScreenContainer>
        ) : null}
        <StatisticalDistricts />
        <Districts mapOptions={mapOptions} embedded={embedded} />
        <TransitStops mapObject={mapObject} />

        {!embedded && !measuringMode && (
          // Draw address popoup on mapclick to map
          <AddressPopup navigator={navigator} />
        )}

        {currentPage === 'address' && <AddressMarker embedded={embedded} />}

        {currentPage === 'unit' &&
          highlightedUnit?.entrances?.length &&
          unitHasLocationAndGeometry(highlightedUnit) && <EntranceMarker />}

        {!disableInteraction &&
          currentPage === 'unit' &&
          unitHasLineStringLocationAndGeometry(highlightedUnit) && (
            <ElevationControl unit={highlightedUnit} isMobile={isMobile} />
          )}

        {!hideUserMarker && userLocation && (
          <UserMarker
            position={[userLocation.latitude, userLocation.longitude]}
            onClick={() => {
              navigateToAddress({
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              });
            }}
          />
        )}

        {measuringMode && (
          <DistanceMeasure
            markerArray={measuringMarkers}
            setMarkerArray={setMeasuringMarkers}
            lineArray={measuringLine}
            setLineArray={setMeasuringLine}
          />
        )}

        <CustomControls position="topleft">
          {!isMobile && !embedded && toggleSidebar ? (
            <HideSidebarButton
              sidebarHidden={sidebarHidden}
              toggleSidebar={toggleSidebar}
            />
          ) : null}
        </CustomControls>

        <CustomControls position="topright">
          <SimpleStatisticalComponent />
        </CustomControls>

        {!disableInteraction ? (
          <CustomControls position="bottomright">
            {!embedded ? (
              /* Custom user location map button */
              <div key="userLocation" className="UserLocation">
                <StyledShowLocationButton
                  aria-hidden
                  aria-label={userLocationAriaLabel}
                  disabled={!userLocation}
                  onClick={() => focusOnUser()}
                  focusVisibleClassName={locationButtonFocusClass}
                >
                  {userLocation ? (
                    <StyledMyLocation />
                  ) : (
                    <StyledLocationDisabled />
                  )}
                </StyledShowLocationButton>
              </div>
            ) : null}

            <PanControl key="panControl" />
          </CustomControls>
        ) : null}
        <CoordinateMarker position={getCoordinatesFromUrl(location)} />
        <EmbeddedActions />
      </MapContainer>
    );
  }
  return null;
}

export default withRouter(MapView);

const StyledLoadingScreenContainer = styled.div(({ theme }) => ({
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: theme.zIndex.infront,
}));

const StyledShowLocationButton = styled(ButtonBase)(({ theme, disabled }) => {
  const styles = {
    marginRight: -3,
    backgroundColor: theme.palette.primary.main,
    width: 40,
    height: 40,
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: theme.palette.primary.highContrast,
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
  };
  if (disabled) {
    Object.assign(styles, {
      backgroundColor: theme.palette.disabled.strong,
    });
  }
  return styles;
});

const StyledMyLocation = styled(MyLocation)(() => ({
  color: '#fff',
}));

const StyledLocationDisabled = styled(LocationDisabled)(() => ({
  color: '#fff',
}));

// Typechecking
MapView.propTypes = {
  hideUserMarker: PropTypes.bool,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  isMobile: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  findUserLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
  measuringMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func,
  sidebarHidden: PropTypes.bool,
  disableInteraction: PropTypes.bool,
};
