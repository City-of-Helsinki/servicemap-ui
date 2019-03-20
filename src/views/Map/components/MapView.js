/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import TransitStopInfo from './TransitStopInfo';
import drawIcon from '../../../utils/drawIcon';

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
    };
  }

  componentDidMount() {
    // The leaflet map works only client-side so it needs to be imported here
    const leaflet = require('react-leaflet'); // eslint-disable-line global-require
    const {
      Map, TileLayer, ZoomControl, Marker, Popup,
    } = leaflet;

    this.setState({
      Map, TileLayer, ZoomControl, Marker, Popup,
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
      mapBase, unitList, mapOptions, style, transitStops, t,
    } = this.props;
    const {
      Map, TileLayer, ZoomControl, Marker, Popup, address, mapClickPoint,
    } = this.state;
    if (Map) {
      return (
        <div>
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

            {transitStops.map(stop => ( // Draw Transit stops to map
              <Marker
                key={stop.name + stop.gtfsId}
                position={[stop.lat, stop.lon]}
                // icon={}
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
        </div>
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
  fetchTransitStops: null,
  fetchAddress: null,
  clearTransitStops: null,
  transitStops: [],
  t: null,
};
