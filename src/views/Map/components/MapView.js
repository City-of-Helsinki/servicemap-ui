/* eslint-disable no-underscore-dangle, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
    };
  }

  componentDidMount() {
    this.initiateLeaflet();
  }

  getAddress(ev) {
    // Get address of clicked location
    const { fetchAddress } = this.props;
    this.setState({ mapClickPoint: null });
    this.setState({ mapClickPoint: ev.latlng, address: null });
    /* Calling parent function and returning value straight here instead of through props
    can it/should it be done like this?? */
    fetchAddress(ev.latlng)
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
      highlightedDistrict,
      style,
      transitStops,
      t,
    } = this.props;
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, Polygon, address, mapClickPoint,
    } = this.state;

    if (highlightedDistrict) {
      // TODO: fix this fitbounds from triggering on each render
      // this.mapRef.current.leafletElement.fitBounds(highlightedDistrict.boundary.coordinates[0]);
    }

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
          onClick={(ev) => { this.getAddress(ev); }}
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
              {address ? (
                <div style={{ display: 'flex', width: '150px' }}>
                  <p style={{ margin: '0px', width: '80%' }}>
                    {`${address.street.name.fi} ${address.number}`}
                  </p>
                  <Link to={`/fi/address/${address.street.municipality}/${address.street.name.fi}/${address.number}`}>
                      Linkki
                  </Link>
                </div>
              ) : (
                <p style={{ margin: '0px', width: '100%' }}>
                  {'Getting address...'}
                </p>
              )}
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
  highlightedDistrict: PropTypes.objectOf(PropTypes.any),
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
  highlightedDistrict: {},
  fetchTransitStops: null,
  fetchAddress: null,
  clearTransitStops: null,
  transitStops: [],
  t: null,
};
