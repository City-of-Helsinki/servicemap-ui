// The maximum bounds of the map
const mapBounds = {
  maxLat: 60.68260671624568,
  maxLng: 26.05329875808676,
  minLat: 59.695219623662894,
  minLng: 23.39691082417145,
};

const mapOptions = {
  initialPosition: [60.171631597530016, 24.906860323934886],
  maxBounds: [
    [mapBounds.maxLat, mapBounds.minLng],
    [mapBounds.maxLat, mapBounds.maxLng],
    [mapBounds.minLat, mapBounds.maxLng],
    [mapBounds.minLat, mapBounds.minLng],
  ],
  // Make district polygon bounds slightly larger than max bounds, so the polygon borders are hidden
  polygonBounds: [
    [mapBounds.maxLat + 10, mapBounds.minLng - 10],
    [mapBounds.maxLat + 10, mapBounds.maxLng + 10],
    [mapBounds.minLat - 10, mapBounds.maxLng + 10],
    [mapBounds.minLat - 10, mapBounds.minLng - 10],
  ],
};

const tileLayers = {
  // These define the options for the different map projections (tms32 and gk25)
  tms32: {
    crsName: 'EPSG:3067',
    projDef: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundsPoints: [[-548576, 6291456], [1548576, 8388608]],
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
  },
  gk25: {
    crsName: 'EPSG:3879',
    projDef: '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundsPoints: [[25440000, 6630000], [25571072, 6761072]],
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
  },
};

const mapTypes = {
  // These define the map tiles and options of individual map types
  servicemap: {
    name: 'servicemap',
    layer: tileLayers.tms32,
    url: 'https://tiles.hel.ninja/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png',
    minZoom: 6,
    maxZoom: 15,
    zoom: 10,
    mobileZoom: 9,
    transitZoom: 14,
    mobileTransitZoom: 13,
  },
  ortoImage: {
    name: 'ortoImage',
    layer: tileLayers.gk25,
    // TODO: maybe have map names and formats as variables from the URL, like in the old version
    url: 'https://kartta.hsy.fi/geoserver/gwc/service/wmts?layer=taustakartat_ja_aluejaot:Ortoilmakuva_2017&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image/jpeg',
    minZoom: 2,
    maxZoom: 10,
    zoom: 5,
    mobileZoom: 4,
    transitZoom: 9,
    mobileTransitZoom: 8,
  },
  guideMap: {
    name: 'guideMap',
    layer: tileLayers.gk25,
    // TODO: maybe have map names and formats as variables from the URL, like in the old version
    url: 'https://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/avoindata:Karttasarja_PKS@ETRS-GK25@png/{z}/{x}/{-y}.png',
    minZoom: 3,
    maxZoom: 10,
    zoom: 5,
    mobileZoom: 4,
    transitZoom: 9,
    mobileTransitZoom: 8,
  },
};

const transitIconSize = 30;
const userIconSize = 50;

export {
  mapOptions,
  mapTypes,
  transitIconSize,
  userIconSize,
};
