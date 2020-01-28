/* eslint-disable global-require, no-underscore-dangle */

const fitUnitsToMap = (units, map) => {
  const L = require('leaflet');

  const corner1 = map.options.maxBounds.getNorthWest();
  const corner2 = map.options.maxBounds.getSouthEast();

  const mapBounds = new L.LatLngBounds([
    [corner1.lat, corner1.lng],
    [corner2.lat, corner2.lng],
  ]);

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
