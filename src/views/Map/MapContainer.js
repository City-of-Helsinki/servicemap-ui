import React from 'react'
import PropTypes from 'prop-types'
import L from 'leaflet'
import './Map.css'
import { connect } from 'react-redux'
import { getMapType } from '../../redux/selectors'
import MapView from './MapView'
import { mapOptions, tileLayers } from '../../config/index'
// import 'leaflet/dist/leaflet.css'

require('proj4leaflet')

class MapContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mapBase: null
    }
  }

  componentDidMount() {
    const { mapType } = this.props
    this.initiateMap(mapType)
  }

  // TODO: move this to utils folder and add the other maps
  initiateMap = (maptype) => {
    if (maptype === 'tms32' || !maptype) {
      const crsName = 'EPSG:3067'
      const projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
      const bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608))
      const originNw = [bounds.min.x, bounds.max.y]
      const crsOpts = {
        resolutions:
          [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
        bounds,
        transformation: new L.Transformation(1, -originNw[0], -1, originNw[1])
      }
      const crs = new L.Proj.CRS(crsName, projDef, crsOpts)
      const layer = tileLayers.tms32
      this.setState({ mapBase: { crs, layer } })
    }
  }

  render() {
    const { mapBase } = this.state
    if (mapBase && mapOptions) {
      return (
        <MapView
          mapBase={mapBase}
          mapOptions={mapOptions}
          // TODO: think about better styling location for map
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
      )
    }
    return null
  }
}

const mapStateToProps = (state) => {
  const mapType = getMapType(state)
  return {
    mapType
  }
}

export default connect(
  mapStateToProps,
  { getMapType }
)(MapContainer)

MapContainer.propTypes = {
  mapType: PropTypes.string
}

MapContainer.defaultProps = {
  mapType: 'tms32'
}
