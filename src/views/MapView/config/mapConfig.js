/* eslint-disable max-len */
import config from '../../../../config';
import { isRetina } from '../../../utils';

// The default maximum bounds of the map
const defaultMapBounds = {
  maxLat: 61.755,
  maxLng: 29.755,
  minLat: 59.1,
  minLng: 21.5,
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
  plainMapLayer: {
    crsName: 'EPSG:3067',
    projDef: '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs',
    boundPoints: [[-548576, 6291456], [1548576, 8388608]],
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625],
    origin: [-548576, 8388608],
  },
  orthoImageLayer: {
    crsName: 'EPSG:3879',
    projDef: '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    boundPoints: [[25472049, 6647388], [25537585, 7695964]],
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
    origin: [25472049, 7646428],
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
    attribution: 'map.attribution.osm',
    generateUrl: (suffix = '') => `${config.servicemapURL}${suffix}.png`,
    minZoom: 9,
    maxZoom: 18,
    zoom: 13,
    clusterPopupVisibility: 13,
    unitZoom: 15,
    mobileZoom: 12,
    detailZoom: 17,
  },
  accessible_map: {
    name: 'accessible_map',
    attribution: 'map.attribution.osm',
    generateUrl: (suffix = '') => `${config.accessibleMapURL}${suffix}.png`,
    minZoom: 9,
    maxZoom: 18,
    zoom: 13,
    clusterPopupVisibility: 13,
    unitZoom: 15,
    mobileZoom: 12,
    detailZoom: 17,
  },
  ortographic: {
    name: 'ortographic',
    attribution: 'map.attribution.helsinki',
    layer: tileLayers.orthoImageLayer,
    // TODO: maybe have map names and formats as variables from the URL, like in the old version
    generateUrl: () => config.ortographicMapURL,
    wmsUrl: config.ortographicWMSURL,
    wmsLayerName: config.ortographicWMSLAYER,
    minZoom: 3,
    maxZoom: 10,
    zoom: 5,
    clusterPopupVisibility: 6,
    unitZoom: 7,
    mobileZoom: 4,
    detailZoom: 9,
    mapBounds: [
      [60.590720832407364, 25.390521218333532],
      [60.590720832407364, 24.276736721022225],
      [59.8994284703215, 24.276736721022225],
      [59.8994284703215, 25.390521218333532],
    ],
  },
  guidemap: {
    name: 'guidemap',
    attribution: 'map.attribution.helsinki',
    layer: tileLayers.guideMapLayer,
    // TODO: maybe have map names and formats as variables from the URL, like in the old version
    generateUrl: () => config.guideMapURL,
    minZoom: 8,
    maxZoom: 15,
    zoom: 10,
    clusterPopupVisibility: 11,
    unitZoom: 12,
    mobileZoom: 9,
    detailZoom: 14,
    mapBounds: [
      [60.402200415095926, 25.271114398151653],
      [60.402200415095926, 24.49246149510767],
      [60.00855312110063, 24.49246149510767],
      [60.00855312110063, 25.271114398151653],
    ],
  },
  plainmap: {
    name: 'plainmap',
    attribution: 'map.attribution.nls',
    layer: tileLayers.plainMapLayer,
    generateUrl: () => config.plainMapURL,
    minZoom: 8,
    maxZoom: 15,
    zoom: 10,
    clusterPopupVisibility: 11,
    unitZoom: 12,
    mobileZoom: 9,
    detailZoom: 14,
    mapBounds: [
      [70.09, 31.59],
      [70.09, 19.08],
      [58.84, 19.08],
      [58.84, 31.59],
    ],
  },
};

const getMapOptions = (type, locale) => {
  const mapOptions = mapTypes[type] || mapTypes.servicemap;

  let suffix = '';
  switch (type) {
    // For servicemap, use retina and/or swedish url if needed
    case 'servicemap': {
      if (isRetina) {
        suffix += '@2x';
      }
      if (locale === 'sv') {
        suffix += '@sv';
      }
      break;
    }
    case 'accessible_map': {
      if (locale === 'sv') {
        suffix += '@sv';
      }
      break;
    }
    default:
  }
  // Generate url based on options
  mapOptions.url = mapOptions.generateUrl(suffix);

  return mapOptions;
};

const transitIconSize = 30;

export {
  mapOptions,
  mapTypes,
  getMapOptions,
  transitIconSize,
};
