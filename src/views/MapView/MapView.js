/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import {
  withStyles, Tooltip as MUITooltip, ButtonBase,
} from '@material-ui/core';
import { MyLocation, LocationDisabled } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { mapOptions } from './config/mapConfig';
import CreateMap from './utils/createMap';
import { focusToPosition } from './utils/mapActions';
import styles from './styles';
import Districts from './components/Districts';
import TransitStops from './components/TransitStops';
import AddressPopup from './components/AddressPopup';
import UserMarker from './components/UserMarker';
import fetchAddress from './utils/fetchAddress';
import { isEmbed } from '../../utils/path';
import AddressMarker from './components/AddressMarker';
import { parseSearchParams } from '../../utils';
import HomeLogo from '../../components/Logos/HomeLogo';
import DistanceMeasure from './components/DistanceMeasure';
import Loading from '../../components/Loading';
import MarkerCluster from './components/MarkerCluster';
import UnitGeometry from './components/UnitGeometry';
import MapUtility from './utils/mapUtility';
import HideSidebarButton from './components/HideSidebarButton';
import CoordinateMarker from './components/CoordinateMarker';
import { useNavigationParams } from '../../utils/address';
import PanControl from './components/PanControl';
import adjustControlElements from './utils';
import EntranceMarker from './components/EntranceMarker';
import EventMarkers from './components/EventMarkers';
import { getSelectedUnitEvents } from '../../redux/selectors/selectedUnit';

if (global.window) {
  require('leaflet');
  require('leaflet.markercluster');
  global.rL = require('react-leaflet');
}

const MapView = (props) => {
  const {
    addressToRender,
    addressUnits,
    adminDistricts,
    classes,
    currentPage,
    intl,
    location,
    settings,
    setAddressLocation,
    unitList,
    unitsLoading,
    serviceUnits,
    districtUnits,
    districtViewFetching,
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
  } = props;
  const mapRef = useRef(null);

  // State
  const [mapObject, setMapObject] = useState(null);
  const [mapClickPoint, setMapClickPoint] = useState(null);
  const [refSaved, setRefSaved] = useState(false);
  const [prevMap, setPrevMap] = useState(null);
  const [unitData, setUnitData] = useState(null);
  const [mapUtility, setMapUtility] = useState(null);
  const [measuringMarkers, setMeasuringMarkers] = useState([]);
  const [measuringLine, setMeasuringLine] = useState([]);

  const embedded = isEmbed({ url: location.pathname });
  const getAddressNavigatorParams = useNavigationParams();

  // This unassigned selector is used to trigger re-render after events are fetched
  useSelector(state => getSelectedUnitEvents(state));


  const getMapUnits = () => {
    let mapUnits = [];

    if (embedded && parseSearchParams(location.search).units === 'none') {
      return [];
    }
    if (currentPage === 'home' && embedded) {
      mapUnits = unitList;
    }
    if (
      currentPage === 'search'
      || currentPage === 'division'
      || (currentPage === 'unit' && unitList.length)
    ) {
      mapUnits = unitList;
    } else if (currentPage === 'address') {
      switch (addressToRender) {
        case 'adminDistricts':
          mapUnits = adminDistricts ? adminDistricts
            .filter(d => d.unit)
            .reduce((unique, o) => {
              // Ignore districts without unit
              if (!o.unit) {
                return unique;
              }
              // Add only unique units
              if (!unique.some(obj => obj.id === o.unit.id)) {
                unique.push(o.unit);
              }
              return unique;
            }, [])
            : [];
          break;
        case 'units':
          mapUnits = addressUnits;
          break;
        default:
          mapUnits = [];
      }
    } else if (currentPage === 'service' && serviceUnits && !unitsLoading) {
      mapUnits = serviceUnits;
    } else if (currentPage === 'area' && districtUnits) {
      mapUnits = districtUnits;
    } else if (
      (currentPage === 'unit' || currentPage === 'fullList' || currentPage === 'event')
      && highlightedUnit
    ) {
      mapUnits = [highlightedUnit];
    }

    return mapUnits;
  };

  const setClickCoordinates = (ev) => {
    if (embedded) return;
    setMapClickPoint(null);
    if (document.getElementsByClassName('leaflet-popup').length > 0) {
      mapRef.current.leafletElement.closePopup();
    } else {
      setMapClickPoint(ev.latlng);
    }
  };

  const saveMapReference = () => {
    setMapRef(mapRef.current);
  };

  const clearMapReference = () => {
    setMapRef(null);
  };

  const initializeMap = () => {
    if (mapRef.current) {
      // If changing map type, save current map viewport values before changing map
      const map = mapRef.current;
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
        mapRef.current.leafletElement,
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
      clearMapReference();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      adjustControlElements();
    }, 1);
  }, [mapObject]);

  useEffect(() => { // Set map ref to redux once map is rendered
    if (!refSaved && mapRef.current) {
      saveMapReference();
      setRefSaved(true);
    }
  });

  useEffect(() => {
    if (currentPage !== 'unit' || !highlightedUnit || !mapUtility) {
      return;
    }
    mapUtility.centerMapToUnit(highlightedUnit);
  }, [highlightedUnit, mapUtility, currentPage]);


  useEffect(() => { // On map type change
    // Init new map and set new ref to redux
    initializeMap();
    setRefSaved(false);
  }, [settings.mapType]);

  useEffect(() => {
    if (mapRef.current) {
      setMapUtility(new MapUtility({ leaflet: mapRef.current.leafletElement }));

      const usp = new URLSearchParams(location.search);
      const lat = usp.get('lat');
      const lng = usp.get('lon');
      try {
        if (lat && lng) {
          const position = [usp.get('lon'), usp.get('lat')];
          focusToPosition(mapRef.current.leafletElement, position);
        }
      } catch (e) {
        console.error('Error while attemptin to focus on coordinate:', e);
      }
    }
  }, [mapRef.current]);

  // Attempt to render unit markers on page change or unitList change
  useEffect(() => {
    setUnitData(getMapUnits());
  }, [
    unitList,
    highlightedUnit,
    addressUnits,
    serviceUnits,
    districtUnits,
    highlightedDistrict,
    currentPage,
  ]);


  useEffect(() => {
    setMapClickPoint(null);
    if (!measuringMode) {
      setMeasuringMarkers([]);
      setMeasuringLine([]);
    }
  }, [measuringMode]);

  // Render

  const renderTopBar = () => {
    if (isMobile) {
      return (
        // TODO: search bar disabled from map until it is fixed
        // <div className={classes.topArea}>
        //   <SearchBar background="none" />
        // </div>
        null
      );
    } return null;
  };

  const renderEmbedOverlay = () => {
    if (!embedded) {
      return null;
    }
    const openApp = () => {
      const url = window.location.href;
      window.open(url.replace('/embed', ''));
    };
    return (
      <ButtonBase onClick={openApp}>
        <MUITooltip title={intl.formatMessage({ id: 'embed.click_prompt_move' })}>
          <HomeLogo aria-hidden className={classes.embedLogo} />
        </MUITooltip>
      </ButtonBase>
    );
  };

  const renderUnitGeometry = () => {
    if (highlightedDistrict) return null;
    if (currentPage !== 'unit') {
      return unitData.map(unit => (
        unit.geometry
          ? <UnitGeometry key={unit.id} data={unit} />
          : null
      ));
    } if (highlightedUnit) {
      return <UnitGeometry data={highlightedUnit} />;
    }
    return null;
  };


  if (global.rL && mapObject) {
    const { Map, TileLayer } = global.rL || {};
    const Control = require('react-leaflet-control').default;
    let center = mapOptions.initialPosition;
    let zoom = isMobile ? mapObject.options.mobileZoom : mapObject.options.zoom;
    if (prevMap) { // If changing map type, use viewport values of previuous map
      center = prevMap.viewport.center || prevMap.props.center;
      /* Different map types have different zoom levels
      Use the zoom difference to calculate the new zoom level */
      const zoomDifference = mapObject.options.zoom - prevMap.defaultZoom;
      zoom = prevMap.viewport.zoom
        ? prevMap.viewport.zoom + zoomDifference
        : prevMap.props.zoom + zoomDifference;
    }

    const showLoadingScreen = districtViewFetching || (embedded && unitsLoading);
    const userLocationAriaLabel = intl.formatMessage({ id: !userLocation ? 'location.notAllowed' : 'location.center' });
    const eventSearch = parseSearchParams(location.search).events;

    return (
      <>
        {renderTopBar()}
        {renderEmbedOverlay()}
        <Map
          tap={false} // This should fix leaflet safari double click bug
          preferCanvas
          className={`${classes.map} ${measuringMode ? classes.measuringCursor : ''} ${embedded || sidebarHidden ? classes.mapNoSidebar : ''} `}
          key={mapObject.options.name}
          ref={mapRef}
          zoomControl={false}
          doubleClickZoom={false}
          crs={mapObject.crs}
          center={center}
          zoom={zoom}
          minZoom={mapObject.options.minZoom}
          maxZoom={mapObject.options.maxZoom}
          unitZoom={mapObject.options.unitZoom}
          detailZoom={mapObject.options.detailZoom}
          maxBounds={mapObject.options.mapBounds || mapOptions.defaultMaxBounds}
          maxBoundsViscosity={1.0}
          onClick={(ev) => { setClickCoordinates(ev); }}
        >
          {eventSearch
            ? <EventMarkers searchData={unitData} />
            : (
              <MarkerCluster
                map={mapRef?.current?.leafletElement}
                data={currentPage === 'unit' && highlightedUnit ? [highlightedUnit] : unitData}
                measuringMode={measuringMode}
              />
            )
          }
          {
            renderUnitGeometry()
          }
          <TileLayer
            url={mapObject.options.url}
            attribution={intl.formatMessage({ id: mapObject.options.attribution })}
          />
          {showLoadingScreen ? (
            <div className={classes.loadingScreen}>
              <Loading />
            </div>
          ) : null}
          <Districts mapOptions={mapOptions} map={mapRef.current} embedded={embedded} />

          <TransitStops
            map={mapRef.current}
            mapObject={mapObject}
            isMobile={isMobile}
          />
          {!embedded && !measuringMode && mapClickPoint && (
            // Draw address popoup on mapclick to map
            <AddressPopup
              mapClickPoint={mapClickPoint}
              getAddressNavigatorParams={getAddressNavigatorParams}
              map={mapRef.current}
              setAddressLocation={setAddressLocation}
              navigator={navigator}
            />
          )}

          {currentPage === 'address' && (
            <AddressMarker embedded={embedded} />
          )}

          {currentPage === 'unit' && highlightedUnit?.entrances?.length && (
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

          <Control position="topleft">
            {!isMobile && !embedded && toggleSidebar ? (
              <HideSidebarButton
                sidebarHidden={sidebarHidden}
                mapRef={mapRef}
                toggleSidebar={toggleSidebar}
              />
            ) : null}
          </Control>
          <PanControl
            Control={Control}
            map={mapRef?.current?.leafletElement}
          />
          {
            !embedded
            && (
              <>
                {/* Custom user location map button */}
                <Control className="UserLocation" position="bottomright">
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
                </Control>
              </>
            )
          }
          <CoordinateMarker />
        </Map>
      </>
    );
  }
  return null;
};

export default withRouter(withStyles(styles)(MapView));

// Typechecking
MapView.propTypes = {
  addressToRender: PropTypes.string,
  addressUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  adminDistricts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    ocd_id: PropTypes.string,
  })),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  hideUserMarker: PropTypes.bool,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  serviceUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  districtUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  districtViewFetching: PropTypes.bool.isRequired,
  setAddressLocation: PropTypes.func.isRequired,
  findUserLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  unitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  unitsLoading: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
  locale: PropTypes.string.isRequired,
  measuringMode: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func,
  sidebarHidden: PropTypes.bool,
};

MapView.defaultProps = {
  addressToRender: null,
  addressUnits: null,
  adminDistricts: null,
  hideUserMarker: false,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  navigator: null,
  serviceUnits: null,
  districtUnits: null,
  unitList: null,
  unitsLoading: false,
  toggleSidebar: null,
  sidebarHidden: false,
  userLocation: null,
};
