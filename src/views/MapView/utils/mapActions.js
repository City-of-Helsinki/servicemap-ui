/* eslint-disable global-require, no-underscore-dangle */
import { mapOptions } from '../config/mapConfig';

const fitUnitsToMap = (units, map) => {
  const L = require('leaflet');
  const mapBounds = new L.LatLngBounds(mapOptions.maxBounds);
  const bounds = [];
  units.forEach((unit) => {
    if (unit.object_type === 'unit' && unit.location && unit.location.coordinates) {
      const unitCoordinates = [unit.location.coordinates[1], unit.location.coordinates[0]];
      // Check that unit is within map bounds
      if (mapBounds.contains(unitCoordinates)) {
        bounds.push(unitCoordinates);
      }
    }
  });
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [15, 15], maxZoom: map._layersMaxZoom - 1 });
  }
};

const focusUnit = (map, coordinates) => {
  map.setView(
    [coordinates[1], coordinates[0]],
    map._layersMaxZoom - 1,
  );
};

const focusDistrict = (map, coordinates) => {
  map.fitBounds(coordinates);
};

export {
  fitUnitsToMap,
  focusUnit,
  focusDistrict,
};
