import React from 'react'
import PropTypes from 'prop-types'
import { Map, /* Marker, Popup, */ TileLayer, ZoomControl } from 'react-leaflet'

const MapView = (props) => {
  const { mapBase, mapOptions, style } = props
  return (
    <Map
      style={style}
      id="mapid"
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
  )
}

export default MapView

// Typechecking
MapView.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  mapBase: PropTypes.objectOf(PropTypes.any),
  mapOptions: PropTypes.objectOf(PropTypes.any)
}

MapView.defaultProps = {
  style: { width: '100%', height: '100%' },
  mapBase: {},
  mapOptions: {}
}
