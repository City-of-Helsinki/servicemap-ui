/* eslint-disable no-underscore-dangle, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import TransitStopInfo from './TransitStopInfo';
import { generatePath } from '../../../utils/path';
import { drawMarkerIcon } from '../utils/drawIcon';

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
export default withRouter(MapView);

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
