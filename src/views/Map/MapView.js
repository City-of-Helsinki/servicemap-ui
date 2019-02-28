import React from 'react';
import PropTypes from 'prop-types';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Map: undefined,
      TileLayer: undefined,
      ZoomControl: undefined,
    };
  }

  componentDidMount() {
    // The leaflet map works only client-side so it needs to be imported here
    const leaflet = require('react-leaflet'); // eslint-disable-line global-require
    const leafletMap = leaflet.Map;
    const leafletTile = leaflet.TileLayer;
    const leafletZoom = leaflet.ZoomControl;
    this.setState({ Map: leafletMap, TileLayer: leafletTile, ZoomControl: leafletZoom });
  }

  render() {
    const {
      mapBase, mapOptions, style, changeMap,
    } = this.props;
    const { Map, TileLayer, ZoomControl } = this.state;
    if (Map) {
      return (
        <div>
          <button
            type="button"
            onClick={() => {
              changeMap();
            }}
          >
            Change Map
          </button>
          <Map
            keyboard={false}
            style={style}
            // id="mapid"
            zoomControl={false}
            crs={mapBase.crs}
            center={mapOptions.initialPosition}
            zoom={mapBase.layer.options.zoom}
            minZoom={mapBase.layer.options.minZoom}
            maxZoom={mapBase.layer.options.maxZoom}
            maxBounds={mapOptions.maxBounds}
          >
            <TileLayer
              url={mapBase.layer.url}
              attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
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
  mapOptions: PropTypes.objectOf(PropTypes.any),
  changeMap: PropTypes.func,
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapBase: {},
  mapOptions: {},
  changeMap: {},
};
