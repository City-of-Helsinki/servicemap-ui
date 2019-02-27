/* eslint-disable react/no-unused-prop-types */
/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
import React from 'react';
import PropTypes from 'prop-types';
// import { Map, /* Marker, Popup, */ TileLayer, ZoomControl } from 'react-leaflet-universal';

let Map;
let TileLayer;
// const { mapBase, mapOptions, style } = props;
class MapView extends React.Component {
  componentDidMount() {
    console.log('did mount');
    // Only runs on Client, not on server render
    Map = require('react-leaflet').Map;
    TileLayer = require('react-leaflet').TileLayer;
    this.forceUpdate();
  }

  render() {
    if (Map) {
      return (
        <div>
          <p>Map here</p>
          <Map
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            id="mapid"
            zoomControl={false}
        // crs={mapBase.crs}
            center={[60.171631597530016, 24.906860323934886]}
            zoom={10}
            minZoom={6}
            maxZoom={15}
            maxBounds={[
              [60.73428157014129, 26.60179232355852],
              [59.59191469116564, 23.40571236451516],
            ]}
          >
            <TileLayer
              url="https://geoserver.hel.fi/mapproxy/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png"
              attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
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
};

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapBase: {},
  mapOptions: {},
};
