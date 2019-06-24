/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withStyles } from '@material-ui/core';
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
      highlightedDistrict: null,
      refSaved: false,
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

  clearTransitStops = () => {
    this.setState({ transitStops: [] });
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
      mapOptions,
      // districtList,
      unitGeometry,
      style,
      navigator,
      getLocaleText,
      mobile,
      settings,
    } = this.props;
    const {
      Map,
      TileLayer,
      ZoomControl,
      Marker,
      Popup,
      Polygon,
      Polyline,
      highlightedDistrict,
      transitStops,
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
            navigator={navigator}
            mapType={mapType}
          />
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
          {highlightedDistrict && highlightedDistrict.unit ? (
            <Marker
              position={[
                highlightedDistrict.unit.location.coordinates[1],
                highlightedDistrict.unit.location.coordinates[0],
              ]}
              icon={drawMarkerIcon(highlightedDistrict.unit, settings)}
              keyboard={false}
            >
              <Popup autoPan={false}>
                <p>{getLocaleText(highlightedDistrict.unit.name)}</p>
              </Popup>
            </Marker>
          ) : null}
          {
            transitStops.map((stop) => {
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
            })
        }
          <ZoomControl position="bottomright" aria-hidden="true" />
        </Map>
      );
    }
    return <p>No map</p>;
  }
}

const styles = ({
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
  // districtList: PropTypes.arrayOf(PropTypes.object),
  mapOptions: PropTypes.objectOf(PropTypes.any),
  unitGeometry: PropTypes.arrayOf(PropTypes.any),
  navigator: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  saveMapRef: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapType: {},
  mapOptions: {},
  unitGeometry: null,
  navigator: null,
  unitList: [],
  // districtList: [],
  mobile: false,
};
