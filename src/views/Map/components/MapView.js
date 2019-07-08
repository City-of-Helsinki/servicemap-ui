/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withStyles, ButtonBase, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import TransitStopInfo from './TransitStopInfo';
import { drawMarkerIcon } from '../utils/drawIcon';
import { fetchStops } from '../utils/transitFetch';
import UnitMarkers from './UnitMarkers';

const transitIconSize = 30;

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      Map: undefined,
      TileLayer: undefined,
      ZoomControl: undefined,
      Marker: undefined,
      Popup: undefined,
      Polygon: undefined,
      refSaved: false,
      mapClickPoint: undefined,
      address: undefined,
      transitStops: [],
    };
  }

  componentDidMount() {
    this.initiateLeaflet();
  }

  componentDidUpdate() {
    this.saveMapReference();
  }

  getTransitIcon = (type) => {
    const { divIcon } = require('leaflet');
    const { classes } = this.props;
    let className = null;
    let id = null;

    switch (type) {
      case 3: // Bus stops
        className = 'busIcon';
        id = 2;
        break;
      case 0: // Tram stops
        className = 'tramIcon';
        id = 3;
        break;
      case 109: // Train stops
        className = 'trainIcon';
        id = 4;
        break;
      case 1: // Subway stops
        className = 'metroIcon';
        id = 5;
        break;
      case -999: // Ferry stops
        className = 'ferryIcon';
        id = 6;
        break;
      default:
        className = 'busIcon';
        id = 2;
        break;
    }
    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span className={classes.transitBackground}>&nbsp;</span>
          <span className={classes[className]}>{id}</span>
        </>,
      ),
      iconSize: [transitIconSize * 1.2, transitIconSize * 1.2],
    });
  }

  getMapRefElement() {
    return this.mapRef.current.leafletElement;
  }

  getAddress(ev) {
    this.setState({ mapClickPoint: null });
    if (document.getElementsByClassName('popup').length > 0) {
      this.mapRef.current.leafletElement.closePopup();
    } else {
      // Get address of clicked location
      this.setState({ mapClickPoint: ev.latlng, address: null });
      this.fetchAddress(ev.latlng)
        .then(data => this.setState({ address: data }));
    }
  }

  clearTransitStops = () => {
    this.setState({ transitStops: [] });
  }

  fetchAddress = async (latlng) => {
    const addressData = await fetch(`https://api.hel.fi/servicemap/v2/address/?lat=${latlng.lat}&lon=${latlng.lng}&page_size=5`)
      .then(response => response.json())
      .then((data) => {
        const address = data.results[0];
        if (address.letter) {
          address.number += address.letter;
        }
        return data;
      });
    return addressData.results[0];
  }

  fetchTransitStops = (bounds) => {
    const { getLocaleText } = this.props;
    fetchStops(bounds)
      .then(((data) => {
        const stops = data[0].data.stopsByBbox;
        const subwayStations = stops.filter(stop => stop.vehicleType === 1);

        // Remove subwaystations from stops list since they will be replaced with subway entrances
        const filteredStops = stops.filter(stop => stop.vehicleType !== 1);

        const entrances = data[1].results;

        // Add subway entrances to the list of stops
        entrances.forEach((entrance) => {
          const closest = {
            distance: null,
            stop: null,
          };
          // Find the subwaystation closest to the entrance
          subwayStations.forEach((stop) => {
            const distance = Math.sqrt(
              ((stop.lat - entrance.location.coordinates[1]) ** 2)
              + ((stop.lon - entrance.location.coordinates[0]) ** 2),
            );
            if (!closest.distance || distance < closest.distance) {
              closest.distance = distance;
              closest.stop = stop;
            }
          });
          // Get the same station's stop for other direction (west/east)
          const otherStop = subwayStations.find(
            station => station.name === closest.stop.name && station.gtfsId !== closest.stop.gtfsId,
          );
          // Create a new stop from the entrance
          // Give it the stop data of the corresponding station and add it to the list of stops
          const newStop = {
            gtfsId: closest.stop.gtfsId,
            secondaryId: otherStop.gtfsId,
            lat: entrance.location.coordinates[1],
            lon: entrance.location.coordinates[0],
            name: getLocaleText(entrance.name),
            patterns: closest.stop.patterns,
            vehicleType: closest.stop.vehicleType,
          };
          filteredStops.push(newStop);
        });
        this.setState({ transitStops: filteredStops });
      }));
  }

  // Check if transit stops should be shown
  showTransitStops() {
    const { mapType, mobile } = this.props;
    const transitZoom = mobile ? mapType.options.mobileTransitZoom : mapType.options.transitZoom;
    const mapRefElement = this.getMapRefElement();
    const currentZoom = mapRefElement.getZoom();
    return currentZoom >= transitZoom;
  }

  saveMapReference() {
    const { saveMapRef } = this.props;
    const { refSaved } = this.state;
    if (this.mapRef.current && !refSaved) {
      this.setState({ refSaved: true });
      saveMapRef(this.mapRef.current);
    }
  }

  initiateLeaflet() {
    // The leaflet map works only client-side so it needs to be imported here
    const leaflet = require('react-leaflet');

    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline,
    } = leaflet;

    this.setState({
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, Polyline,
    });
  }

  render() {
    const {
      mapType,
      unitList,
      highlightedDistrict,
      mapOptions,
      unitGeometry,
      style,
      getLocaleText,
      mobile,
      settings,
      navigator,
      classes,
      setAddressLocation,
    } = this.props;
    const {
      Map,
      TileLayer,
      ZoomControl,
      Marker,
      Popup,
      Polygon,
      Polyline,
      transitStops,
      mapClickPoint,
      address,
    } = this.state;

    const zoomLevel = mobile ? mapType.options.mobileZoom : mapType.options.zoom;

    if (Map) {
      return (
        <Map
          ref={this.mapRef}
          keyboard={false}
          style={style}
          zoomControl={false}
          crs={mapType.crs}
          center={mapOptions.initialPosition}
          zoom={zoomLevel}
          minZoom={mapType.options.minZoom}
          maxZoom={mapType.options.maxZoom}
          maxBounds={mapOptions.maxBounds}
          onClick={(ev) => { this.getAddress(ev); }}
          onMoveEnd={() => {
            if (this.showTransitStops()) {
              this.fetchTransitStops(this.getMapRefElement());
            } else if (transitStops.length > 0) {
              this.clearTransitStops();
            }
          }}
        >
          <TileLayer
            url={mapType.options.url}
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
          />
          <UnitMarkers
            data={unitList}
            Marker={Marker}
            mapType={mapType}
          />

          {unitGeometry ? (
            <Polyline
              positions={[
                unitGeometry,
              ]}
              color="#ff8400"
            />
          ) : null}
          {highlightedDistrict ? (
            <Polygon
              positions={[
                [mapOptions.polygonBounds],
                [highlightedDistrict.boundary.coordinates[0]],
              ]}
              color="#ff8400"
              fillColor="#000"
            />
          ) : null}
          {highlightedDistrict && highlightedDistrict.unit && highlightedDistrict.unit.location ? (
            <>
              <Marker
                position={[
                  highlightedDistrict.unit.location.coordinates[1],
                  highlightedDistrict.unit.location.coordinates[0],
                ]}
                icon={drawMarkerIcon(highlightedDistrict.unit, settings)}
                keyboard={false}
                onClick={() => {
                  if (navigator) {
                    if (mobile) {
                      navigator.replace('unit', { id: highlightedDistrict.unit.id });
                    } else {
                      navigator.push('unit', { id: highlightedDistrict.unit.id });
                    }
                  }
                }}
              />
              {/* Popup for the district unit name */}
              <Popup
                className="popup"
                offset={[-1, -29]}
                closeButton={false}
                autoPan={false}
                position={[
                  highlightedDistrict.unit.location.coordinates[1],
                  highlightedDistrict.unit.location.coordinates[0],
                ]}
              >
                <Typography
                  noWrap
                  className={classes.popup}
                >
                  {getLocaleText(highlightedDistrict.unit.name)}
                </Typography>
              </Popup>
            </>
          ) : null}
          {transitStops.map((stop) => {
            // Draw transit markers if zoom is within allowed limits
            if (this.showTransitStops()) {
              return (
                <Marker
                  icon={this.getTransitIcon(stop.vehicleType)}
                  key={stop.name + stop.gtfsId}
                  position={[stop.lat, stop.lon]}
                  keyboard={false}
                >
                  <Popup autoPan={false}>
                    <TransitStopInfo stop={stop} />
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
          {mapClickPoint && ( // Draw address popoup on mapclick to map
            <Popup className="popup" closeButton={false} autoPan={false} position={[mapClickPoint.lat, mapClickPoint.lng]}>
              {address ? (
                <div
                  className={classes.addressPopup}
                >
                  <Typography variant="body2">
                    {`${getLocaleText(address.street.name)} ${address.number}`}
                  </Typography>
                  <ButtonBase
                    style={{ paddingTop: '9px', paddingBottom: 12 }}
                    onClick={() => {
                      if (navigator) {
                        this.mapRef.current.leafletElement.closePopup();
                        setAddressLocation({
                          addressId: address.street.id,
                          clickCoordinates: [mapClickPoint.lat, mapClickPoint.lng],
                        });
                        navigator.push('address', {
                          municipality: address.street.municipality,
                          street: getLocaleText(address.street.name),
                          number: address.number,
                        });
                      }
                    }}
                  >
                    <Typography className={classes.addressLink} variant="button">
                      <FormattedMessage id="map.address.info" />
                    </Typography>
                  </ButtonBase>
                </div>

              ) : (
                <div className={classes.popup}>
                  <Typography variant="body2">
                    <FormattedMessage id="map.address.searching" />
                  </Typography>
                </div>
              )}
            </Popup>
          )}
          <ZoomControl position="bottomright" aria-hidden="true" />
        </Map>
      );
    }
    return <p>No map</p>;
  }
}

const styles = theme => ({
  addressLink: {
    color: theme.palette.primary.main,
  },
  popup: {
    padding: 12,
  },
  addressPopup: {
    lineHeight: '6px',
    padding: 12,
    paddingBottom: 0,
    width: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  transitBackground: {
    zIndex: -1,
    width: '67%',
    height: '67%',
    backgroundColor: 'white',
    position: 'absolute',
    top: '51%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: '14%',
  },
  busIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#007AC9',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  tramIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#00985F',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  trainIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#8C4799',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  metroIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#FF6319',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
  ferryIcon: {
    fontFamily: 'hsl-piktoframe',
    color: '#00B9E4',
    fontSize: transitIconSize,
    lineHeight: '125%',
  },
});

export default withRouter(withStyles(styles)(MapView));

// Typechecking
MapView.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  mapType: PropTypes.objectOf(PropTypes.any),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
  mapOptions: PropTypes.objectOf(PropTypes.any),
  unitGeometry: PropTypes.arrayOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  saveMapRef: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  setAddressLocation: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapType: {},
  mapOptions: {},
  unitGeometry: null,
  unitList: [],
  highlightedDistrict: null,
  mobile: false,
  navigator: null,
};
