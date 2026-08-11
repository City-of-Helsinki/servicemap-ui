import pointOnFeature from '@turf/point-on-feature';
import { useLocation } from 'react-router';

import { parseSearchParams } from '../../../utils';
import { mapHasMapPane } from '../../../utils/mapUtility';
import { isEmbed } from '../../../utils/path';
import swapCoordinates from './swapCoordinates';

const L =
  typeof window !== 'undefined' ? (await import('leaflet')).default : null;

const useMapFocusDisabled = () => {
  const location = useLocation();
  const searchParams = parseSearchParams(location.search);
  return isEmbed() && !!searchParams.bbox;
};

// Leaflet derives view and marker pixel positions from the container size it
// cached at init. In an embed iframe the container is often still settling then,
// so refresh the size before every focus action to avoid focusing a stale size.
const refreshMapSize = (map) => {
  if (map && mapHasMapPane(map)) {
    map.invalidateSize();
  }
};

const fitUnitsToMap = (units, map) => {
  // Return early on server side
  if (typeof window === 'undefined') {
    return;
  }

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
        if (!mapHasMapPane(map)) return;
        refreshMapSize(map);
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
  refreshMapSize(map);
  map.setView([coordinates[1], coordinates[0]], zoom);
};

const focusDistrict = (map, coordinates) => {
  const bounds = coordinates.map((area) => swapCoordinates(area));
  const safeBounds = bounds.filter(
    (boundary) => Array.isArray(boundary) && boundary.length
  );
  if (!safeBounds.length) {
    return;
  }
  refreshMapSize(map);
  map.fitBounds(safeBounds);
};

const getBoundaryPolygons = (boundary) => {
  if (!Array.isArray(boundary?.coordinates)) {
    return [];
  }
  return boundary.type === 'Polygon'
    ? [boundary.coordinates]
    : boundary.coordinates;
};

const focusDistricts = (map, districts) => {
  const filteredData = districts.filter((obj) => obj.boundary);
  const bounds = filteredData.map((district) =>
    getBoundaryPolygons(district.boundary).map((area) => swapCoordinates(area))
  );
  const safeBounds = bounds.filter(
    (boundary) => Array.isArray(boundary) && boundary.length
  );
  if (!safeBounds.length) {
    return;
  }
  refreshMapSize(map);
  map.fitBounds(safeBounds);
};

const getBoundsFromBbox = (bbox) => {
  if (!bbox) return null;

  // Return null on server side
  if (typeof window === 'undefined') {
    return null;
  }

  const sw = L.latLng(bbox.slice(0, 2));
  const ne = L.latLng(bbox.slice(2, 4));
  return L.latLngBounds(sw, ne);
};

const fitBbox = (map, bbox) => {
  if (!map || !bbox || bbox.length !== 4) {
    return;
  }
  const bounds = getBoundsFromBbox(bbox);

  refreshMapSize(map);
  map.fitBounds(bounds);
};

const panViewToBounds = (map, selectedGeometry, geometryGroup) => {
  try {
    if (!L) return;
    const mapBounds = map.getBounds();
    // Get point inside geometry
    const geometryPoint = pointOnFeature(selectedGeometry).geometry.coordinates;
    const pointLatLng = L.latLng(geometryPoint);
    // If point is outside of map bounds, move map to area
    if (!mapBounds.contains(pointLatLng)) {
      if (geometryGroup?.length) {
        // If a group of geomteries is given, fit them all to map
        map.fitBounds(geometryGroup);
      } else {
        map.fitBounds(selectedGeometry.coordinates);
      }
    }
  } catch (err) {
    console.warn('Fit districts to map failed', err);
  }
};

export {
  fitBbox,
  fitUnitsToMap,
  focusDistrict,
  focusDistricts,
  focusToPosition,
  getBoundaryPolygons,
  getBoundsFromBbox,
  panViewToBounds,
  refreshMapSize,
  useMapFocusDisabled,
};
