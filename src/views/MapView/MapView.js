/* eslint-disable global-require */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles, Typography } from '@material-ui/core';
import { intlShape, FormattedMessage } from 'react-intl';
import { mapOptions } from './config/mapConfig';
import CreateMap from './utils/createMap';
import swapCoordinates from './utils/swapCoordinates';
import UnitMarkers from './components/UnitMarkers';
import { focusUnit } from './utils/mapActions';
import styles from './styles';
import Districts from './components/Districts';
import TransitStops from './components/TransitStops';
import AddressPopup from './components/AddressPopup';
import LocationButton from './components/LocationButton';
import SearchBar from '../../components/SearchBar';
import UserMarker from './components/UserMarker';
import fetchAddress from './utils/fetchAddress';
import { isEmbed } from '../../utils/path';
import AddressMarker from './components/AddressMarker';
import BackButton from '../../components/BackButton';


const MapView = (props) => {
  const {
    classes,
    currentPage,
    getLocaleText,
    intl,
    settings,
    addressUnits,
    setAddressLocation,
    unitList,
    unitsLoading,
    serviceUnits,
    highlightedUnit,
    highlightedDistrict,
    isMobile,
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


  const getMapUnits = () => {
    let mapUnits = [];
    let unitGeometry = null;

    if (currentPage === 'search') {
      mapUnits = unitList;
    } else if (currentPage === 'address') {
      mapUnits = addressUnits;
    } else if (currentPage === 'service' && serviceUnits && !unitsLoading) {
      mapUnits = serviceUnits;
    } else if ((currentPage === 'unit' || currentPage === 'fullList' || currentPage === 'event') && highlightedUnit) {
      mapUnits = [highlightedUnit];
      const { geometry } = highlightedUnit;
      if (geometry && geometry.type === 'MultiLineString') {
        const { coordinates } = geometry;
        unitGeometry = swapCoordinates(coordinates);
      }
    }
    return { units: mapUnits, unitGeometry };
  };

  const renderTopBar = () => {
    if (isMobile) {
      return (
        <div className={classes.topArea}>
          <div className={classes.flexRow}>
            <BackButton className={`${classes.colorInherit} ${classes.backButton}`} variant="icon" />
            <Typography color="inherit" variant="body2"><FormattedMessage id="general.backTo" /></Typography>
          </div>
          <SearchBar background="none" placeholder={intl.formatMessage({ id: 'search.placeholder' })} />
        </div>
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
    const newMap = CreateMap(settings.mapType, locale);
    setMapObject(newMap);
  };

  const initializeLeaflet = () => {
    // The leaflet map works only client-side so it needs to be imported here
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline, Tooltip,
    } = require('react-leaflet');

    setLeaflet({
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline, Tooltip,
    });
  };

  const focusOnUser = () => {
    if (userLocation) {
      focusUnit(
        mapRef.current.leafletElement,
        [userLocation.longitude, userLocation.latitude],
      );
    } else {
      findUserLocation();
    }
  };

  const navigateToAddress = (latLng) => {
    fetchAddress(latLng)
      .then((data) => {
        navigator.push('address', {
          municipality: data.street.municipality,
          street: getLocaleText(data.street.name),
          number: data.number,
        });
      });
  };


  useEffect(() => { // On map mount
    initializeLeaflet();
    initializeMap();
    findUserLocation();
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


  // Render

  const {
    Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline, Tooltip,
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
    const embeded = isEmbed(match);

    return (
      <>
        {renderTopBar()}
        <Map
          className={classes.map}
          key={mapObject.options.name}
          ref={mapRef}
          keyboard={false}
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
                Marker={Marker}
                Polyline={Polyline}
                Tooltip={Tooltip}
                embeded={embeded}
              />
            )
          }
          <Districts
            Polygon={Polygon}
            Marker={Marker}
            Popup={Popup}
            highlightedDistrict={highlightedDistrict}
            getLocaleText={getLocaleText}
            settings={settings}
            mapOptions={mapOptions}
            mobile={isMobile}
            navigator={navigator}
          />

          {!embeded
            && (
              <TransitStops
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

          {userLocation && (
            <UserMarker
              position={[userLocation.latitude, userLocation.longitude]}
              classes={classes}
              onClick={() => {
                navigateToAddress({ lat: userLocation.latitude, lng: userLocation.longitude });
              }}
            />
          )}

          <ZoomControl position="bottomright" aria-hidden="true" />
          <LocationButton
            disabled={!userLocation}
            position="bottomright"
            handleClick={userLocation ? focusOnUser : null}
          />
        </Map>
      </>
    );
  }
  return null;
};

export default withRouter(withStyles(styles)(MapView));

// Typechecking
MapView.propTypes = {
  addressUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  isMobile: PropTypes.bool,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  serviceUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  setAddressLocation: PropTypes.func.isRequired,
  findUserLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  unitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  unitsLoading: PropTypes.bool,
  userLocation: PropTypes.objectOf(PropTypes.any),
  locale: PropTypes.string.isRequired,
};

MapView.defaultProps = {
  addressUnits: null,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  navigator: null,
  serviceUnits: null,
  unitList: null,
  unitsLoading: false,
  userLocation: null,
};
