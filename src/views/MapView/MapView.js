/* eslint-disable global-require */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { ButtonBase } from '@mui/material';
import { MyLocation, LocationDisabled } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useMapEvents } from 'react-leaflet';
import { mapOptions } from './config/mapConfig';
import CreateMap from './utils/createMap';
import { focusToPosition, getBoundsFromBbox } from './utils/mapActions';
import Districts from './components/Districts';
import TransitStops from './components/TransitStops';
import AddressPopup from './components/AddressPopup';
import UserMarker from './components/UserMarker';
import fetchAddress from './utils/fetchAddress';
import { isEmbed } from '../../utils/path';
import AddressMarker from './components/AddressMarker';
import { parseSearchParams } from '../../utils';
import DistanceMeasure from './components/DistanceMeasure';
import MarkerCluster from './components/MarkerCluster';
import UnitGeometry from './components/UnitGeometry';
import MapUtility from './utils/mapUtility';
import Util from '../../utils/mapUtility';
import HideSidebarButton from './components/HideSidebarButton';
import CoordinateMarker from './components/CoordinateMarker';
import { useNavigationParams } from '../../utils/address';
import PanControl from './components/PanControl';
import adjustControlElements from './utils';
import EntranceMarker from './components/EntranceMarker';
import EventMarkers from './components/EventMarkers';
import CustomControls from './components/CustomControls';
import { getSelectedUnitEvents } from '../../redux/selectors/selectedUnit';
import useMapUnits from './utils/useMapUnits';
import { Loading } from '../../components';
import StatisticalDistricts from './components/StatisticalDistricts';
import { getStatisticalDistrictUnitsState } from '../../redux/selectors/statisticalDistrict';
import SimpleStatisticalComponent from './components/StatisticalDataMapInfo';

if (global.window) {
  require('leaflet');
  require('leaflet.markercluster');
  global.rL = require('react-leaflet');
}

const EmbeddedActions = () => {
  const embedded = isEmbed();
  const map = useMapEvents({
    moveend() {
      if (embedded) {
        const bounds = map.getBounds();
        window.parent.postMessage({ bbox: `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}` });
      }
    },
  });

  return null;
};

const MapView = (props) => {
  const {
    classes,
    currentPage,
    intl,
    location,
    settings,
    unitsLoading,
    hideUserMarker,
    highlightedUnit,
    highlightedDistrict,
    isMobile,
    setMapRef,
    navigator,
    findUserLocation,
    userLocation,
    locale,
    measuringMode,
    toggleSidebar,
    sidebarHidden,
    disableInteraction,
  } = props;

  // State
  const [mapObject, setMapObject] = useState(null);
  const [mapElement, setMapElement] = useState(null);
  const [prevMap, setPrevMap] = useState(null);
  const [mapUtility, setMapUtility] = useState(null);
  const [measuringMarkers, setMeasuringMarkers] = useState([]);
  const [measuringLine, setMeasuringLine] = useState([]);

  const embedded = isEmbed({ url: location.pathname });
  const getAddressNavigatorParams = useNavigationParams();
  const districtUnitsFetch = useSelector(state => state.districts.unitFetch);
  const statisticalDistrictFetch = useSelector(getStatisticalDistrictUnitsState);
  const districtsFetching = useSelector(state => !!state.districts.districtsFetching?.length);
  const districtViewFetching = districtUnitsFetch.isFetching || districtsFetching;
  const unitData = useMapUnits();

  // This unassigned selector is used to trigger re-render after events are fetched
  useSelector(state => getSelectedUnitEvents(state));


  const initializeMap = () => {
    if (mapElement) {
      // If changing map type, save current map viewport values before changing map
      const map = mapElement;
      map.defaultZoom = mapObject.options.zoom;
      setPrevMap(map);
    }
    // Search param map value
    const spMap = parseSearchParams(location.search).map || false;
    const mapType = spMap || (embedded ? 'servicemap' : settings.mapType);

    const newMap = CreateMap(mapType, locale);
    setMapObject(newMap);
  };

  const focusOnUser = () => {
    if (userLocation) {
      focusToPosition(
        mapElement,
        [userLocation.longitude, userLocation.latitude],
      );
    } else if (!embedded) {
      findUserLocation();
    }
  };

  const navigateToAddress = (latLng) => {
    fetchAddress(latLng)
      .then((data) => {
        navigator.push('address', getAddressNavigatorParams(data));
      });
  };

  const getCoordinatesFromUrl = () => {
    // Attempt to get coordinates from URL
    const usp = new URLSearchParams(location.search);
    const lat = usp.get('lat');
    const lng = usp.get('lon');
    if (!lat || !lng) {
      return null;
    }
    return [lat, lng];
  };

  useEffect(() => { // On map mount
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


  useEffect(() => { // On map type change
    // Init new map and set new ref to redux
    initializeMap();
  }, [settings.mapType]);

  useEffect(() => {
    if (mapElement) {
      setMapUtility(new MapUtility({ leaflet: mapElement }));

      const usp = new URLSearchParams(location.search);
      const lat = usp.get('lat');
      const lng = usp.get('lon');
      try {
        if (lat && lng) {
          const position = [usp.get('lon'), usp.get('lat')];
          focusToPosition(mapElement, position);
        }
      } catch (e) {
        console.warn('Error while attemptin to focus on coordinate:', e);
      }
    }
  }, [mapElement]);


  useEffect(() => {
    if (!measuringMode) {
      setMeasuringMarkers([]);
      setMeasuringLine([]);
    }
  }, [measuringMode]);

  const unitHasLocationAndGeometry = (un) => un?.location && un?.geometry;

  // Render

  const renderUnitGeometry = () => {
    if (highlightedDistrict) return null;
    if (currentPage !== 'unit') {
      return unitData.map(unit => (
        unit.geometry
          ? <UnitGeometry key={unit.id} data={unit} />
          : null
      ));
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
    if (prevMap && Util.mapHasMapPane(prevMap)) {
      center = prevMap.getCenter() || prevMap.options.center;
      /* Different map types have different zoom levels
      Use the zoom difference to calculate the new zoom level */
      const zoomDifference = mapObject.options.zoom - prevMap.defaultZoom;
      zoom = prevMap.getZoom()
        ? prevMap.getZoom() + zoomDifference
        : prevMap.options.zoom + zoomDifference;
    }

    const showLoadingScreen = statisticalDistrictFetch.isFetching
      || districtViewFetching
      || (embedded && unitsLoading);
    let showLoadingReducer = null;
    let hideLoadingNumbers = false;
    if (statisticalDistrictFetch.isFetching) {
      showLoadingReducer = statisticalDistrictFetch;
      hideLoadingNumbers = true;
    } else if (districtViewFetching) {
      showLoadingReducer = {
        ...districtUnitsFetch,
        isFetching: districtViewFetching,
      };
    }
    const userLocationAriaLabel = intl.formatMessage({ id: !userLocation ? 'location.notAllowed' : 'location.center' });
    const eventSearch = parseSearchParams(location.search).events;
    const defaultBounds = parseSearchParams(location.search).bbox;

    return (
      <>
        <MapContainer
          tap={false} // This should fix leaflet safari double click bug
          preferCanvas
          className={`${classes.map} ${embedded ? classes.mapNoSidebar : ''} `}
          key={mapObject.options.name}
          zoomControl={false}
          bounds={getBoundsFromBbox(defaultBounds?.split(','))}
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
          whenCreated={(map) => {
            setMapElement(map);
            setMapRef(map);
          }}
        >
          {eventSearch
            ? <EventMarkers searchData={unitData} />
            : (
              <MarkerCluster
                data={unitData}
                measuringMode={measuringMode}
                disableInteraction={disableInteraction}
              />
            )
          }
          {
            renderUnitGeometry()
          }
          {mapObject.options.name === 'ortographic' && mapObject.options.wmsUrl !== 'undefined'
            ? ( // Use WMS service for ortographic maps, because HSY's WMTS tiling does not work
              <WMSTileLayer
                url={mapObject.options.wmsUrl}
                layers={mapObject.options.wmsLayerName}
                attribution={intl.formatMessage({ id: mapObject.options.attribution })}
              />
            )
            : (
              <TileLayer
                url={mapObject.options.url}
                attribution={intl.formatMessage({ id: mapObject.options.attribution })}
              />
            )}
          {showLoadingScreen ? (
            <div className={classes.loadingScreen}>
              <Loading reducer={showLoadingReducer} hideNumbers={hideLoadingNumbers} />
            </div>
          ) : null}
          <StatisticalDistricts />
          <Districts mapOptions={mapOptions} embedded={embedded} />
          <TransitStops mapObject={mapObject} />

          {!embedded && !measuringMode && (
            // Draw address popoup on mapclick to map
            <AddressPopup navigator={navigator} />
          )}

          {currentPage === 'address' && (
            <AddressMarker embedded={embedded} />
          )}

          {currentPage === 'unit' && highlightedUnit?.entrances?.length && unitHasLocationAndGeometry(highlightedUnit) && (
            <EntranceMarker />
          )}

          {!hideUserMarker && userLocation && (
            <UserMarker
              position={[userLocation.latitude, userLocation.longitude]}
              classes={classes}
              onClick={() => {
                navigateToAddress({ lat: userLocation.latitude, lng: userLocation.longitude });
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

          {!disableInteraction
            ? (
              <CustomControls position="bottomright">
                {!embedded ? (
                /* Custom user location map button */
                  <div key="userLocation" className="UserLocation">
                    <ButtonBase
                      aria-hidden
                      aria-label={userLocationAriaLabel}
                      disabled={!userLocation}
                      className={`${classes.showLocationButton} ${!userLocation ? classes.locationDisabled : ''}`}
                      onClick={() => focusOnUser()}
                      focusVisibleClassName={classes.locationButtonFocus}
                    >
                      {userLocation
                        ? <MyLocation className={classes.showLocationIcon} />
                        : <LocationDisabled className={classes.showLocationIcon} />
                  }
                    </ButtonBase>
                  </div>
                ) : null}

                <PanControl key="panControl" />
              </CustomControls>
            )
            : null}
          <CoordinateMarker position={getCoordinatesFromUrl()} />
          <EmbeddedActions />
        </MapContainer>
      </>
    );
  }
  return null;
};

export default withRouter(MapView);

// Typechecking
MapView.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  hideUserMarker: PropTypes.bool,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  findUserLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  unitsLoading: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
  locale: PropTypes.string.isRequired,
  measuringMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func,
  sidebarHidden: PropTypes.bool,
  disableInteraction: PropTypes.bool,
};

MapView.defaultProps = {
  hideUserMarker: false,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  navigator: null,
  unitsLoading: false,
  toggleSidebar: null,
  sidebarHidden: false,
  userLocation: null,
  disableInteraction: false,
};
