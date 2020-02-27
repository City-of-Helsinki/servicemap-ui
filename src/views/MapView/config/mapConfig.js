/* eslint-disable max-len */
import config from '../../../../config';
import { isRetina } from '../../../utils';

// The default maximum bounds of the map
const defaultMapBounds = {
  maxLat: 60.68260671624568,
  maxLng: 26.05329875808676,
  minLat: 59.695219623662894,
  minLng: 23.39691082417145,
};

const mapOptions = {
  initialPosition: config.initialMapPosition,
  defaultMaxBounds: [
    [defaultMapBounds.maxLat, defaultMapBounds.minLng],
    [defaultMapBounds.maxLat, defaultMapBounds.maxLng],
    [defaultMapBounds.minLat, defaultMapBounds.maxLng],
    [defaultMapBounds.minLat, defaultMapBounds.minLng],
  ],
  // Make district polygon bounds slightly larger than max bounds, so the polygon borders are hidden
  polygonBounds: [
    [defaultMapBounds.maxLat + 10, defaultMapBounds.minLng - 10],
    [defaultMapBounds.maxLat + 10, defaultMapBounds.maxLng + 10],
    [defaultMapBounds.minLat - 10, defaultMapBounds.maxLng + 10],
    [defaultMapBounds.minLat - 10, defaultMapBounds.minLng - 10],
  ],
};

const tileLayers = {
  // These define the options for the different map projections
  guideMapLayer: {
    crsName: 'EPSG:3879',
    projDef: '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundPoints: [[24451424, 6291456], [26548576, 8388608]],
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625],
    origin: [24451424, 8388608],
  },
  orthoImageLayer: {
    crsName: 'EPSG:3879',
    projDef: '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundPoints: [[25440000, 6630000], [25571072, 6761072]],
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
  },
  // tms35 not used currently
  // tms35: {
  //   crsName: 'EPSG:3067',
  //   projDef: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  //   boundPoints: [[-548576, 6291456], [1548576, 8388608]],
  //   resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
  // },
};

const mapTypes = {
  // These define the map tiles and options of individual map types
  servicemap: {
    name: 'servicemap',
    url: 'https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}.png',
    minZoom: 9,
    maxZoom: 18,
    zoom: 13,
    clusterPopupVisibility: 13,
    mobileZoom: 12,
    transitZoom: 17,
    mobileTransitZoom: 16,
  },
  accessible_map: {
    name: 'accessible_map',
    url: 'https://tiles.hel.ninja/styles/turku-osm-high-contrast-pattern/{z}/{x}/{y}.png',
    minZoom: 9,
    maxZoom: 18,
    zoom: 13,
    clusterPopupVisibility: 13,
    mobileZoom: 12,
    transitZoom: 17,
    mobileTransitZoom: 16,
  },
  ortographic: {
    name: 'ortographic',
    layer: tileLayers.orthoImageLayer,
    // TODO: maybe have map names and formats as variables from the URL, like in the old version
    url: 'https://kartta.hsy.fi/geoserver/gwc/service/wmts?layer=taustakartat_ja_aluejaot:Ortoilmakuva_2017&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image/jpeg',
    minZoom: 3,
    maxZoom: 10,
    zoom: 5,
    clusterPopupVisibility: 6,
    mobileZoom: 4,
    transitZoom: 9,
    mobileTransitZoom: 8,
    mapBounds: [
      [60.590720832407364, 25.390521218333532],
      [60.590720832407364, 24.276736721022225],
      [59.8994284703215, 24.276736721022225],
      [59.8994284703215, 25.390521218333532],
    ],
  },
  guideMap: {
    name: 'guideMap',
    layer: tileLayers.guideMapLayer,
    // TODO: maybe have map names and formats as variables from the URL, like in the old version
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/gwc/service/wmts?layer=avoindata:Karttasarja_PKS&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image%2Fpng',
    minZoom: 8,
    maxZoom: 15,
    zoom: 10,
    clusterPopupVisibility: 11,
    mobileZoom: 9,
    transitZoom: 14,
    mobileTransitZoom: 13,
    mapBounds: [
      [60.402200415095926, 25.271114398151653],
      [60.402200415095926, 24.49246149510767],
      [60.00855312110063, 24.49246149510767],
      [60.00855312110063, 25.271114398151653],
    ],
  },
  // TODO: Add "accessible_map"
};

const getMapOptions = (type, locale) => {
  const mapOptions = mapTypes[type] || mapTypes.servicemap;
  // For servicemap, use retina and/or swedish url if needed
  if (type === 'servicemap') {
    let suffix = '';
    if (isRetina) {
      suffix += '@2x';
    }
    if (locale === 'sv') {
      suffix += '@sv';
    }
    // Set new url for servicemap
    mapOptions.url = `https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}${suffix}.png`;
  }

  return mapOptions;
};

const transitIconSize = 30;

export {
  mapOptions,
  mapTypes,
  getMapOptions,
  transitIconSize,
};
