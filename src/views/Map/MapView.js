import React from 'react';
import PropTypes from 'prop-types';
import drawIcon from '../../utils/drawIcon';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Map: undefined,
      TileLayer: undefined,
      ZoomControl: undefined,
      Marker: undefined,
    };
  }

  componentDidMount() {
    // The leaflet map works only client-side so it needs to be imported here
    const leaflet = require('react-leaflet'); // eslint-disable-line global-require
    const leafletMap = leaflet.Map;
    const leafletTile = leaflet.TileLayer;
    const leafletZoom = leaflet.ZoomControl;
    const leafletMarker = leaflet.Marker;
    this.setState({
      Map: leafletMap, TileLayer: leafletTile, ZoomControl: leafletZoom, Marker: leafletMarker,
    });
  }

  render() {
    const {
      mapBase, unitList, mapOptions, style,
    } = this.props;
    const {
      Map, TileLayer, ZoomControl, Marker,
    } = this.state;
    if (Map) {
      return (
        <div>
          <Map
            keyboard={false}
            style={style}
            // id="mapid"
            zoomControl={false}
            crs={mapBase.crs}
            center={mapOptions.initialPosition}
            zoom={mapBase.options.zoom}
            minZoom={mapBase.options.minZoom}
            maxZoom={mapBase.options.maxZoom}
            maxBounds={mapOptions.maxBounds}
          >
            <TileLayer
              url={mapBase.options.url}
              attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            {unitList.map(unit => (
              <Marker
                key={unit.id ? unit.id : unit[0].id}
                position={unit.lat ? [unit.lat, unit.lng] : [unit[0].lat, unit[0].lng]}
                icon={drawIcon(unit, mapBase.options.name)}
              />
            ))}
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
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapBase: {},
  mapOptions: {},
  unitList: [],
};
