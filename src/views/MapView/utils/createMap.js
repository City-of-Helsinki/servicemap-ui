/* eslint-disable global-require */
import { mapTypes } from '../config/mapConfig';

let L;
// Check if we are on client side because leafelt map works only on client side
if (typeof window !== 'undefined') {
  require('proj4leaflet');
  L = require('leaflet');
}

const CreateMap = (mapType) => {
  const options = mapTypes[mapType];

  // Functions for leaflet crs generation
  const bounds = L.bounds(
    L.point(options.layer.boundsPoints[0]),
    L.point(options.layer.boundsPoints[1]),
  );
  const crsOpts = {
    resolutions: options.layer.resolutions,
    bounds,
    transformation: new L.Transformation(1, -bounds.min.x, -1, bounds.max.y),
  };
  const crs = new L.Proj.CRS(options.layer.crsName, options.layer.projDef, crsOpts);
  const mapBase = { crs, options };

  return mapBase;
};

export default CreateMap;
