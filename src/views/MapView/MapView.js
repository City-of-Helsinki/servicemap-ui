/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, Tooltip as MUITooltip, ButtonBase } from '@material-ui/core';
import { MyLocation, LocationDisabled } from '@material-ui/icons';
import { mapOptions } from './config/mapConfig';
import CreateMap from './utils/createMap';
import UnitMarkers from './components/UnitMarkers';
import { focusToPosition } from './utils/mapActions';
import styles from './styles';
import Districts from './components/Districts';
import TransitStops from './components/TransitStops';
import AddressPopup from './components/AddressPopup';
import UserMarker from './components/UserMarker';
import fetchAddress from './utils/fetchAddress';
import { isEmbed } from '../../utils/path';
import AddressMarker from './components/AddressMarker';
import isClient, { parseSearchParams } from '../../utils';
import swapCoordinates from './utils/swapCoordinates';
import HomeLogo from '../../components/Logos/HomeLogo';


const MapView = (props) => {
  const {
    addressToRender,
    addressUnits,
    adminDistricts,
    classes,
    createMarkerClusterLayer,
    currentPage,
    distanceCoordinates,
    getAddressNavigatorParams,
    getLocaleText,
    intl,
    location,
    settings,
    setAddressLocation,
    unitList,
    unitsLoading,
    serviceUnits,
    hideUserMarker,
    highlightedUnit,
    highlightedDistrict,
    isMobile,
    renderUnitMarkers,
    setMapRef,
    navigator,
    match,
    findUserLocation,
    userLocation,
    locale,
  } = props;


  const mapRef = useRef(null);

  // State
  const [mapObject, setMapObject] = useState(null);
  const [mapClickPoint, setMapClickPoint] = useState(null);
  const [leaflet, setLeaflet] = useState(null);
  const [refSaved, setRefSaved] = useState(false);
  const [prevMap, setPrevMap] = useState(null);
  const [markerCluster, setMarkerCluster] = useState(null);
  const [distancePosition, setDistancePosition] = useState(null);

  const embeded = isEmbed(match);

  const getMapUnits = () => {
    let mapUnits = [];
    let unitGeometry = null;

    if (currentPage === 'home' || currentPage === 'search' || currentPage === 'division') {
      mapUnits = unitList;
    } else if (currentPage === 'address') {
      switch (addressToRender) {
        case 'adminDistricts':
          mapUnits = adminDistricts ? adminDistricts
            .filter(d => d.unit)
            .map(d => d.unit)
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
    } else if ((currentPage === 'unit' || currentPage === 'fullList' || currentPage === 'event') && highlightedUnit) {
      mapUnits = [highlightedUnit];
      const { geometry } = highlightedUnit;
      if (geometry && geometry.type === 'MultiLineString') {
        const { coordinates } = geometry;
        unitGeometry = coordinates;
      }
    }

    const data = { units: mapUnits, unitGeometry };

    if (data.unitGeometry) {
      data.unitGeometry = swapCoordinates(data.unitGeometry);
    }

    return data;
  };

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

  const setClickCoordinates = (ev) => {
    setMapClickPoint(null);
    if (document.getElementsByClassName('popup').length > 0) {
      mapRef.current.leafletElement.closePopup();
    } else {
      setMapClickPoint(ev.latlng);
    }
  };

  const saveMapReference = () => {
    setMapRef(mapRef.current);
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

    const newMap = CreateMap(spMap || settings.mapType, locale);
    setMapObject(newMap);
  };

  const initializeLeaflet = () => {
    // The leaflet map works only client-side so it needs to be imported here
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline, Tooltip,
    } = require('react-leaflet');

    const Control = require('react-leaflet-control');

    const L = require('leaflet');
    require('leaflet.markercluster');

    const {
      divIcon, point, marker, markerClusterGroup,
    } = L;

    setLeaflet({
      divIcon,
      point,
      Map,
      marker,
      markerClusterGroup,
      TileLayer,
      ZoomControl,
      Marker,
      Popup,
      Polygon,
      Polyline,
      Tooltip,
      Control: Control.default,
    });
  };

  // Markercluster initializer
  const initializeMarkerClusterLayer = () => {
    const map = mapRef && mapRef.current ? mapRef.current : null;

    if (map && leaflet && createMarkerClusterLayer && isClient()) {
      const popupTexts = {
        title: intl.formatMessage({ id: 'unit.plural' }),
        info: count => intl.formatMessage({ id: 'map.unit.cluster.popup.info' }, { count }),
      };
      const cluster = createMarkerClusterLayer(leaflet, map, classes, popupTexts, embeded);
      if (cluster) {
        // Remove old layer
        if (markerCluster) {
          map.leafletElement.removeLayer(markerCluster);
        }
        map.leafletElement.addLayer(cluster);
        setMarkerCluster(cluster);
      }
    }
  };

  const focusOnUser = () => {
    if (userLocation) {
      focusToPosition(
        mapRef.current.leafletElement,
        [userLocation.longitude, userLocation.latitude],
      );
    } else if (!embeded) {
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
    initializeLeaflet();
    initializeMap();
    if (!embeded) {
      findUserLocation();
    }
  }, []);

  useEffect(() => { // Set map ref to redux once map is rendered
    if (!refSaved && mapRef.current) {
      saveMapReference();
      setRefSaved(true);
    }
  });

  useEffect(() => { // On map type change
    // Init new map and set new ref to redux
    initializeMap();
    setRefSaved(false);
  }, [settings.mapType]);

  // Set distance position used for redrawing markecluster layer
  useEffect(() => {
    if (!distanceCoordinates && distancePosition) {
      setDistancePosition(null);
      return;
    }
    if (!distancePosition && distanceCoordinates) {
      setDistancePosition(distanceCoordinates);
      return;
    }
    if (
      distanceCoordinates
      && distancePosition
      && (
        distanceCoordinates.latitude !== distancePosition.latitude
        || distanceCoordinates.longitude !== distancePosition.longitude
      )
    ) {
      setDistancePosition(distanceCoordinates);
    }
  }, [distanceCoordinates]);

  // Create new markercluster layer when map is loaded or when distancePosition changes
  useEffect(() => {
    initializeMarkerClusterLayer();
  }, [mapObject, leaflet, distancePosition]);

  // Attempt to render unit markers on page change or unitList change
  useEffect(() => {
    if (!markerCluster) {
      return;
    }

    const data = getMapUnits();
    const map = mapRef && mapRef.current ? mapRef.current.leafletElement : null;
    // Clear layers if no units currently set for data
    // caused by while fetching
    if (!data.units.length || (currentPage === 'address' && highlightedDistrict)) {
      markerCluster.clearLayers();
      return;
    }
    if (map) {
      renderUnitMarkers(leaflet, map, data, classes, markerCluster, embeded);
    }
  }, [unitList, highlightedUnit, markerCluster, addressUnits, serviceUnits, highlightedDistrict]);

  // Render

  const renderEmbedOverlay = () => {
    if (!embeded) {
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


  const {
    Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline, Tooltip, Control,
  } = leaflet || {};

  if (Map && mapObject) {
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

    return (
      <>
        {renderTopBar()}
        {renderEmbedOverlay()}
        <Map
          className={classes.map}
          key={mapObject.options.name}
          ref={mapRef}
          zoomControl={false}
          doubleClickZoom={false}
          crs={mapObject.crs}
          center={center}
          zoom={zoom}
          minZoom={mapObject.options.minZoom}
          maxZoom={mapObject.options.maxZoom}
          maxBounds={mapObject.options.mapBounds || mapOptions.defaultMaxBounds}
          maxBoundsViscosity={1.0}
          onClick={(ev) => { setClickCoordinates(ev); }}
        >
          <TileLayer
            url={mapObject.options.url}
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
          />
          {
            !highlightedDistrict
            && (
              <UnitMarkers
                data={getMapUnits()}
                Polyline={Polyline}
              />
            )
          }
          <Districts
            Polygon={Polygon}
            Marker={Marker}
            Popup={Popup}
            Tooltip={Tooltip}
            mapOptions={mapOptions}
            map={mapRef.current}
          />

          {!embeded
            && (
              <TransitStops
                getLocaleText={getLocaleText}
                Marker={Marker}
                Popup={Popup}
                map={mapRef.current}
                mapObject={mapObject}
                isMobile={isMobile}
              />
            )
          }
          {!embeded && mapClickPoint && ( // Draw address popoup on mapclick to map
            <AddressPopup
              Popup={Popup}
              mapClickPoint={mapClickPoint}
              getAddressNavigatorParams={getAddressNavigatorParams}
              getLocaleText={getLocaleText}
              map={mapRef.current}
              setAddressLocation={setAddressLocation}
              navigator={navigator}
            />
          )}

          {currentPage === 'address' && (
            <AddressMarker
              Marker={Marker}
              Tooltip={Tooltip}
              getLocaleText={getLocaleText}
              embeded={embeded}
            />
          )}

          { !hideUserMarker && userLocation && (
            <UserMarker
              position={[userLocation.latitude, userLocation.longitude]}
              classes={classes}
              onClick={() => {
                navigateToAddress({ lat: userLocation.latitude, lng: userLocation.longitude });
              }}
            />
          )}

          <ZoomControl position="bottomright" aria-hidden="true" />
          {
            !embeded
            && (
              /* Custom user location map button */
              <Control position="bottomright">
                <ButtonBase
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
            )
          }
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
  createMarkerClusterLayer: PropTypes.func.isRequired,
  currentPage: PropTypes.string.isRequired,
  distanceCoordinates: PropTypes.shape({
    latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  getAddressNavigatorParams: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  hideUserMarker: PropTypes.bool,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  serviceUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  setAddressLocation: PropTypes.func.isRequired,
  findUserLocation: PropTypes.func.isRequired,
  renderUnitMarkers: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  unitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  unitsLoading: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
  locale: PropTypes.string.isRequired,
};

MapView.defaultProps = {
  addressToRender: null,
  addressUnits: null,
  adminDistricts: null,
  distanceCoordinates: null,
  hideUserMarker: false,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  navigator: null,
  serviceUnits: null,
  unitList: null,
  unitsLoading: false,
  userLocation: null,
};
