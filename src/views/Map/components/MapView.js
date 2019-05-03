/* eslint-disable no-underscore-dangle, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { withStyles } from '@material-ui/core';
import TransitStopInfo from './TransitStopInfo';
import { generatePath } from '../../../utils/path';
import { drawMarkerIcon } from '../utils/drawIcon';

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
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon,
    } = leaflet;

    this.setState({
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon,
    });
  }

  render() {
    const {
      mapBase,
      unitList,
      mapOptions,
      // districtList,
      style,
      fetchTransitStops,
      clearTransitStops,
      history,
      match,
      transitStops,
      getLocaleText,
    } = this.props;
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, highlightedDistrict,
    } = this.state;
    const { params } = match;
    const lng = params && params.lng;

    const unitListFiltered = unitList.filter(unit => unit.object_type === 'unit');

    if (Map) {
      return (
        <Map
          ref={this.mapRef}
          keyboard={false}
          style={style}
          zoomControl={false}
          crs={mapBase.crs}
          center={mapOptions.initialPosition}
          zoom={mapBase.options.zoom}
          minZoom={mapBase.options.minZoom}
          maxZoom={mapBase.options.maxZoom}
          maxBounds={mapOptions.maxBounds}
          onMoveEnd={() => {
            if (this.mapRef.current.leafletElement._zoom >= mapBase.options.transitZoom) {
              fetchTransitStops(this.mapRef.current.leafletElement);
            } else if (transitStops.length > 0) {
              clearTransitStops();
            }
          }}
        >
          <TileLayer
            url={mapBase.options.url}
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
          />
          {unitListFiltered.map((unit) => {
            // Show markers with location
            if (unit && unit.location) {
              return (
                <Marker
                  className="unitMarker"
                  key={unit.id}
                  position={[unit.location.coordinates[1], unit.location.coordinates[0]]}
                  icon={drawMarkerIcon(unit, mapBase.options.name)}
                  onClick={() => history.push(generatePath('unit', lng, unit.id))}
                  keyboard={false}
                />
              );
            } return null;
          })}
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
              icon={drawMarkerIcon(highlightedDistrict.unit, mapBase.options.name)}
              keyboard={false}
            >
              <Popup autoPan={false}>
                <p>{getLocaleText(highlightedDistrict.unit.name)}</p>
              </Popup>
            </Marker>
          ) : null}
          {transitStops.map(stop => (
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
          ))}
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
  mapBase: PropTypes.objectOf(PropTypes.any),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  // districtList: PropTypes.arrayOf(PropTypes.object),
  mapOptions: PropTypes.objectOf(PropTypes.any),
  fetchTransitStops: PropTypes.func,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  clearTransitStops: PropTypes.func,
  transitStops: PropTypes.arrayOf(PropTypes.object),
  getLocaleText: PropTypes.func.isRequired,
  saveMapRef: PropTypes.func.isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapBase: {},
  mapOptions: {},
  unitList: [],
  // districtList: [],
  fetchTransitStops: null,
  clearTransitStops: null,
  transitStops: [],
};
