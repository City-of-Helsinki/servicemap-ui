/* eslint-disable global-require */
import { createMapOptions } from '../constants/mapConstants';

let L;
// Check if we are on client side because leafelt map works only on client side
if (typeof window !== 'undefined') {
  require('proj4leaflet');
  L = require('leaflet');
}

const CreateMap = (mapType, locale) => {
  const options = createMapOptions(mapType, locale);
  const { layer } = options;

  if (!layer) {
    const crs = L.CRS.EPSG3857;
    const mapBase = { crs, options };
    return mapBase;
  }

  // Functions for leaflet crs generation
  const bounds = L.bounds(
    L.point(layer.boundsPoints[0]),
    L.point(layer.boundsPoints[1]),
  );
  const crsOpts = {
    resolutions: layer.resolutions,
    bounds,
    transformation: new L.Transformation(1, -bounds.min.x, -1, bounds.max.y),
  };
  const crs = new L.Proj.CRS(layer.crsName, layer.projDef, crsOpts);
  const mapBase = { crs, options };

  return mapBase;
};

export default CreateMap;
