import swapCoordinates from './swapCoordinates';

/* eslint-disable global-require, no-underscore-dangle */

const fitUnitsToMap = (units, map) => {
  const L = require('leaflet');

  const corner1 = map.options.maxBounds.getNorthWest();
  const corner2 = map.options.maxBounds.getSouthEast();
  const { maxZoom } = map.options;

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
    map.fitBounds(bounds, { padding: [15, 15], maxZoom: maxZoom - 1 });
  }
};


const focusToPosition = (map, coordinates, zoomOption) => {
  const zoom = typeof zoomOption === 'number' ? zoomOption : map.options.maxZoom - 1;
  map.setView(
    [coordinates[1], coordinates[0]],
    zoom,
  );
};

const focusDistrict = (map, coordinates) => {
  const bounds = coordinates.map(area => swapCoordinates(area));
  map.fitBounds(bounds);
};

const fitBbox = (map, bbox) => {
  if (!map || !bbox || bbox.length !== 4) {
    return;
  }
  const L = require('leaflet');
  const sw = L.latLng(bbox.slice(0, 2));
  const ne = L.latLng(bbox.slice(2, 4));
  const bounds = L.latLngBounds(sw, ne);
  map.fitBounds(bounds);
};

export {
  fitBbox,
  fitUnitsToMap,
  focusToPosition,
  focusDistrict,
};
