/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { intlShape } from 'react-intl';
import { mapOptions } from './config/mapConfig';
import CreateMap from './utils/createMap';
import swapCoordinates from './utils/swapCoordinates';
import UnitMarkers from './components/UnitMarkers';
import styles from './styles';
import Districts from './components/Districts';
import TransitStops from './components/TransitStops';
import AddressPopup from './components/AddressPopup';
import SearchBar from '../../components/SearchBar';
import TitleBar from '../../components/TitleBar/TitleBar';


class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      mapType: null,
      refSaved: false,
      mapClickPoint: null,
      address: null,
      leaflet: null,
      transitStops: [],
    };
  }

  componentDidMount() {
    this.initializeLeaflet();
    this.initializeMap();
  }

  componentDidUpdate() {
    this.saveMapReference();
  }

  getMapRefElement() {
    if (this.mapRef.current) {
      return this.mapRef.current.leafletElement;
    }
    return null;
  }

  getMapUnits = () => {
    const {
      currentPage, unitList, addressUnits, serviceUnits, unitsLoading, highlightedUnit,
    } = this.props;
    let mapUnits = [];
    let unitGeometry = null;

    if (currentPage === 'search') {
      mapUnits = unitList;
    } else if (currentPage === 'address') {
      mapUnits = addressUnits;
    } else if (currentPage === 'service' && serviceUnits && !unitsLoading) {
      mapUnits = serviceUnits;
    } else if ((currentPage === 'unit' || currentPage === 'fullList') && highlightedUnit) {
      mapUnits = [highlightedUnit];
      const { geometry } = highlightedUnit;
      if (geometry && geometry.type === 'MultiLineString') {
        const { coordinates } = geometry;
        unitGeometry = swapCoordinates(coordinates);
      }
    }
    return { units: mapUnits, unitGeometry };
  }

  renderTopBar = () => {
    const {
      isMobile, currentPage, highlightedUnit, addressTitle, getLocaleText, intl,
    } = this.props;
    if (isMobile) {
      const top = currentPage === 'map' ? 64 : 0;
      return (
        <>
          <div
            style={{
              zIndex: 99999999, position: 'fixed', top, width: '100%',
            }}
          >
            {currentPage === 'map' && (
            // If on root map page (/map) display search bar.
            <SearchBar hideBackButton placeholder={intl.formatMessage({ id: 'search' })} />
            )}
            {currentPage === 'unit' && highlightedUnit && (
            // If on unit's map page (/unit?map=true) display title bar
            <TitleBar title={getLocaleText(highlightedUnit.name)} primary backButton />
            )}
            {currentPage === 'address' && addressTitle && (
            // If on address's map page (/address?map=true) display title bar
            <TitleBar title={addressTitle} />
            )}
          </div>
        </>
      );
    } return null;
  }

  setClickCoordinates = (ev) => {
    this.setState({ mapClickPoint: null });
    if (document.getElementsByClassName('popup').length > 0) {
      this.mapRef.current.leafletElement.closePopup();
    } else {
      this.setState({ mapClickPoint: ev.latlng, address: null });
    }
  }

  saveMapReference = () => {
    const { setMapRef } = this.props;
    const { refSaved } = this.state;
    if (this.mapRef.current && !refSaved) {
      this.setState({ refSaved: true });
      setMapRef(this.mapRef.current);
    }
  }

  initializeMap = () => {
    const { mapType } = this.props;
    this.setState({ mapType: CreateMap(mapType) });
  }

  initializeLeaflet = () => {
    // The leaflet map works only client-side so it needs to be imported here
    const leaflet = require('react-leaflet');
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline,
    } = leaflet;
    this.setState({
      leaflet: {
        Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline,
      },
    });
  }


  render() {
    const {
      highlightedDistrict, getLocaleText, isMobile, settings, navigator, setAddressLocation, classes,
    } = this.props;
    const {
      leaflet, transitStops, mapClickPoint, address, mapType,
    } = this.state;
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline,
    } = leaflet || {};

    if (Map && mapType) {
      const zoomLevel = isMobile ? mapType.options.mobileZoom : mapType.options.zoom;
      return (
        <>
          {this.renderTopBar()}
          <Map
            className={classes.map}
            key={mapType.crs.code}
            ref={this.mapRef}
            keyboard={false}
            zoomControl={false}
            crs={mapType.crs}
            center={mapOptions.initialPosition}
            zoom={zoomLevel}
            minZoom={mapType.options.minZoom}
            maxZoom={mapType.options.maxZoom}
            maxBounds={mapOptions.maxBounds}
            onClick={(ev) => { this.setClickCoordinates(ev); }}
          >
            <TileLayer
              url={mapType.options.url}
              attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            <UnitMarkers
              data={this.getMapUnits()}
              Marker={Marker}
              Polyline={Polyline}
              mapType={mapType}
            />
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
            <TransitStops
              Marker={Marker}
              Popup={Popup}
              transitStops={transitStops}
              map={this.mapRef.current}
              mapType={mapType}
              isMobile={isMobile}
            />
            {mapClickPoint && ( // Draw address popoup on mapclick to map
              <AddressPopup
                Popup={Popup}
                address={address}
                mapClickPoint={mapClickPoint}
                getLocaleText={getLocaleText}
                map={this.mapRef.current}
                setAddressLocation={setAddressLocation}
                navigator={navigator}
              />
            )}

            <ZoomControl position="bottomright" aria-hidden="true" />
          </Map>
        </>
      );
    }
    return null;
  }
}

export default withRouter(withStyles(styles)(MapView));

// Typechecking
MapView.propTypes = {
  addressTitle: PropTypes.string,
  addressUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  highlightedUnit: PropTypes.objectOf(PropTypes.any),
  intl: intlShape.isRequired,
  isMobile: PropTypes.bool,
  mapType: PropTypes.string.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  serviceUnits: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  setAddressLocation: PropTypes.func.isRequired,
  setMapRef: PropTypes.func.isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  unitList: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  unitsLoading: PropTypes.bool,
};

MapView.defaultProps = {
  addressTitle: null,
  addressUnits: null,
  highlightedDistrict: null,
  highlightedUnit: null,
  isMobile: false,
  navigator: null,
  serviceUnits: null,
  unitList: null,
  unitsLoading: false,
};
