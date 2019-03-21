/* eslint-disable no-underscore-dangle, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import TransitStopInfo from './TransitStopInfo';
import drawIcon from '../utils/drawIcon';

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
      address: undefined,
      mapClickPoint: undefined,
      Polygon: undefined,
      highlightedDistrict: null,
    };
  }

  componentDidMount() {
    this.initiateLeaflet();
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

  getAddress(e) {
    // Get address of clicked location
    const { fetchAddress } = this.props;
    this.setState({ mapClickPoint: null });
    this.setState({ mapClickPoint: e.latlng, address: null });
    /* Calling parent function and returning value straight here instead of through props
    can it/should it be done like this?? */
    fetchAddress(e.latlng)
      .then(data => this.setState({ address: data }));
  }

  getTransitStops() {
    // Fetch transit stops of screen area
    const {
      fetchTransitStops, clearTransitStops, transitStops, mapBase,
    } = this.props;
    if (this.mapRef.current.leafletElement._zoom >= mapBase.options.transitZoom) {
      fetchTransitStops(this.mapRef.current.leafletElement);
    } else if (transitStops.length > 0) {
      clearTransitStops();
    }
  }

  render() {
    const {
      mapBase,
      unitList,
      mapOptions,
      districtList,
      style,
      transitStops,
      t,
    } = this.props;
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, highlightedDistrict, address, mapClickPoint,
    } = this.state;
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
          onClick={(e) => { this.getAddress(e); }}
          onMoveEnd={() => {
            this.getTransitStops();
          }}
        >
          <TileLayer
            url={mapBase.options.url}
            attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
          />

          {unitList.map(unit => ( // Draw unit markers to map
            <Marker
              key={unit.id ? unit.id : unit[0].id}
              position={unit.lat ? [unit.lat, unit.lng] : [unit[0].lat, unit[0].lng]}
              icon={drawIcon(unit, mapBase.options.name)}
            />
          ))}

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
              icon={drawIcon(highlightedDistrict.unit, mapBase.options.name)}
            >
              <Popup autoPan={false}>
                <p>{highlightedDistrict.unit.name.fi}</p>
              </Popup>
            </Marker>
          ) : null}

          {transitStops.map(stop => ( // Draw Transit stops to map
            <Marker
              key={stop.name + stop.gtfsId}
              position={[stop.lat, stop.lon]}
            >
              <Popup autoPan={false}>
                <TransitStopInfo t={t} stop={stop} />
              </Popup>
            </Marker>
          ))}

          {mapClickPoint ? ( // Draw address popoup on mapclick to map
            <Popup autoPan={false} position={[mapClickPoint.lat, mapClickPoint.lng]}>
              <div style={{ display: 'flex', width: '150px' }}>
                <p style={{ margin: '0px', width: '80%' }}>
                  {address ? `${address.street.name.fi} ${address.number}` : 'Getting address...'}
                </p>
              </div>
            </Popup>
          ) : null}

          <ZoomControl position="bottomright" />
        </Map>
      );
    }
    return <p>No map</p>;
  }
}
export default MapView;

// Typechecking
MapView.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  mapBase: PropTypes.objectOf(PropTypes.any),
  unitList: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.array])),
  districtList: PropTypes.arrayOf(PropTypes.object),
  mapOptions: PropTypes.objectOf(PropTypes.any),
  fetchTransitStops: PropTypes.func,
  fetchAddress: PropTypes.func,
  clearTransitStops: PropTypes.func,
  transitStops: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func,
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapBase: {},
  mapOptions: {},
  unitList: [],
  districtList: [],
  fetchTransitStops: null,
  fetchAddress: null,
  clearTransitStops: null,
  transitStops: [],
  t: null,
};
