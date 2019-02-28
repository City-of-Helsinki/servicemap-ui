// Map config
const mapOptions = {
  initialPosition: [60.171631597530016, 24.906860323934886],
  // Max bounds could be defined separately for differernt map types
  maxBounds: [
    [60.73428157014129, 26.60179232355852],
    [59.59191469116564, 23.40571236451516],
  ],
};

const tileLayers = {
  // These define the options for the different map projections (tms32 and gk25)
  tms32: {
    crsName: 'EPSG:3067',
    projDef: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundsPoints: [[-548576, 6291456], [1548576, 8388608]],
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],

    // These define the map tiles and options of individual map types of this projection
    servicemap: {
      url: 'https://geoserver.hel.fi/mapproxy/wmts/osm-sm-hq/etrs_tm35fin_hq/{z}/{x}/{y}.png',
      options: {
        minZoom: 6,
        maxZoom: 15,
        zoom: 10,
      },
    },
  },
  gk25: {
    crsName: 'EPSG:3879',
    projDef: '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundsPoints: [[25440000, 6630000], [25571072, 6761072]],
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],

    ortoImage: {
      // TODO: maybe have map names and formats as variables from the URL, like in the old version
      url: 'https://kartta.hsy.fi/geoserver/gwc/service/wmts?layer=taustakartat_ja_aluejaot:Ortoilmakuva_2017&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image/jpeg',
      options: {
        minZoom: 2,
        maxZoom: 10,
        zoom: 5,
      },
    },
    guideMap: {
      // TODO: maybe have map names and formats as variables from the URL, like in the old version
      url: 'https://kartta.hel.fi/ws/geoserver/gwc/service/tms/1.0.0/avoindata:Karttasarja_PKS@ETRS-GK25@png/{z}/{x}/{-y}.png',
      options: {
        minZoom: 3,
        maxZoom: 10,
        zoom: 5,
      },
    },
  },
};

export {
  mapOptions,
  tileLayers,
};
