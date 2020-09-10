/* eslint-disable global-require */
import { getMapOptions } from '../config/mapConfig';
import config from '../../../../config';

let L;
// Check if we are on client side because leafelt map works only on client side
if (typeof window !== 'undefined') {
  require('proj4leaflet');
  L = require('leaflet');
}

const CreateMap = (mapType, locale) => {
  let type = mapType;
  if (!config.maps.includes(type)) {
    type = 'servicemap';
  }
  // const options = mapTypes[mapType];
  const options = getMapOptions(type, locale);
  const { layer } = options;

  if (!layer) {
    const crs = L.CRS.EPSG3857;
    const mapBase = { crs, options };
    return mapBase;
  }

  // Functions for leaflet crs generation
  const bounds = L.bounds(
    L.point(layer.boundPoints[0]),
    L.point(layer.boundPoints[1]),
  );
  const crsOpts = {
    origin: layer.origin,
    resolutions: layer.resolutions,
    bounds,
    transformation: new L.Transformation(1, -bounds.min.x, -1, bounds.max.y),
  };
  const crs = new L.Proj.CRS(layer.crsName, layer.projDef, crsOpts);
  const mapBase = { crs, options };

  return mapBase;
};

export default CreateMap;
