import pointOnFeature from '@turf/point-on-feature';
import { useLocation } from 'react-router';

import { parseSearchParams } from '../../../utils';
import { isEmbed } from '../../../utils/path';
import swapCoordinates from './swapCoordinates';

/* eslint-disable global-require, no-underscore-dangle */

const useMapFocusDisabled = () => {
  const location = useLocation();
  const searchParams = parseSearchParams(location.search);
  return isEmbed() && !!searchParams.bbox;
};

const fitUnitsToMap = (units, map) => {
  // Return early on server side
  if (typeof window === 'undefined') {
    return;
  }

  const L = require('leaflet');

  const corner1 = map.options.maxBounds.getNorthWest();
  const corner2 = map.options.maxBounds.getSouthEast();
  const { maxZoom } = map.options;

  const mapBounds = new L.LatLngBounds([
    [corner1.lat, corner1.lng],
    [corner2.lat, corner2.lng],
  ]);

  const unitList = units.map((obj) =>
    obj.object_type === 'event' ? obj.location : obj
  );

  const bounds = [];

  unitList.forEach((unit) => {
    if (!unit) return;
    const coordinates =
      unit.location?.coordinates || unit.position?.coordinates;
    if (unit.object_type === 'unit' && coordinates) {
      const unitCoordinates = [coordinates[1], coordinates[0]];
      // Check that unit is within map bounds
      if (mapBounds.contains(unitCoordinates)) {
        bounds.push(unitCoordinates);
      }
    }
  });
  if (bounds.length > 0) {
    try {
      setTimeout(() => {
        map.invalidateSize();
        map.fitBounds(bounds, { padding: [15, 15], maxZoom: maxZoom - 1 });
      }, 1);
    } catch (err) {
      console.warn('Fit units to map failed', err);
    }
  }
};

const focusToPosition = (map, coordinates, zoomOption) => {
  const zoom =
    typeof zoomOption === 'number' ? zoomOption : map.options.maxZoom - 1;
  map.setView([coordinates[1], coordinates[0]], zoom);
};

const focusDistrict = (map, coordinates) => {
  const bounds = coordinates.map((area) => swapCoordinates(area));
  map.fitBounds(bounds);
};

const focusDistricts = (map, districts) => {
  const filteredData = districts.filter((obj) => obj.boundary);
  const bounds = filteredData.map((district) =>
    district.boundary.coordinates.map((area) => swapCoordinates(area))
  );
  map.fitBounds(bounds);
};

const getBoundsFromBbox = (bbox) => {
  if (!bbox) return null;

  // Return null on server side
  if (typeof window === 'undefined') {
    return null;
  }

  const L = require('leaflet');
  const sw = L.latLng(bbox.slice(0, 2));
  const ne = L.latLng(bbox.slice(2, 4));
  return L.latLngBounds(sw, ne);
};

const fitBbox = (map, bbox) => {
  if (!map || !bbox || bbox.length !== 4) {
    return;
  }
  const bounds = getBoundsFromBbox(bbox);

  map.fitBounds(bounds);
};

const panViewToBounds = (map, selectedGeometry, geometryGroup) => {
  const mapBounds = map.getBounds();
  // Get point inside geometry
  const geometryPoint = pointOnFeature(selectedGeometry).geometry.coordinates;
  const pointLatLng = global.L.latLng(geometryPoint);
  // If point is outside of map bounds, move map to area
  if (!mapBounds.contains(pointLatLng)) {
    try {
      if (geometryGroup?.length) {
        // If a group of geomteries is given, fit them all to map
        map.fitBounds(geometryGroup);
      } else {
        map.fitBounds(selectedGeometry.coordinates);
      }
    } catch (err) {
      console.warn('Fit districts to map failed', err);
    }
  }
};

export {
  fitBbox,
  fitUnitsToMap,
  focusDistrict,
  focusDistricts,
  focusToPosition,
  getBoundsFromBbox,
  panViewToBounds,
  useMapFocusDisabled,
};
