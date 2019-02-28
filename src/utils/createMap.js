import { tileLayers } from '../config/mapConfig';

let L;
// Check if we are on client side because leafelt map works only on client side
if (typeof window !== 'undefined') {
  require('proj4leaflet'); // eslint-disable-line global-require
  L = require('leaflet'); // eslint-disable-line global-require
}

const CreateMap = (mapType) => {
  let options = null;
  let layer = null;

  if (mapType === 'servicemap' || !mapType) {
    options = tileLayers.tms32;
    layer = options.servicemap;
  } else if (mapType === 'ortoImage') {
    options = tileLayers.gk25;
    layer = options.ortoImage;
  } else if (mapType === 'guideMap') {
    options = tileLayers.gk25;
    layer = options.guideMap;
  }

  // Functions for leaflet crs generation
  const bounds = L.bounds(L.point(options.boundsPoints[0]), L.point(options.boundsPoints[1]));
  const crsOpts = {
    resolutions: options.resolutions,
    bounds,
    transformation: new L.Transformation(1, -bounds.min.x, -1, bounds.max.y),
  };
  const crs = new L.Proj.CRS(options.crsName, options.projDef, crsOpts);
  const mapBase = { crs, layer };

  return mapBase;
};

export default CreateMap;
