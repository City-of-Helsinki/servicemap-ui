// Map config
const mapOptions = {
  initialPosition: [60.171631597530016, 24.906860323934886],
  minZoom: 6,
  maxZoom: 15,
  zoom: 10,
  maxBounds: [
    [60.73428157014129, 26.60179232355852],
    [59.59191469116564, 23.40571236451516]
  ]
}

const tileLayers = {
  tms32: {
    url: 'https://geoserver.hel.fi/mapproxy/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png',
  },
  gk25: {
    // TODO: fix url
    url: 'https://geoserver.hel.fi/mapproxy/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png',
  }
}

export {
  mapOptions,
  tileLayers
}
