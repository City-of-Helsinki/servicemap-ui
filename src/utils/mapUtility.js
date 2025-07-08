/**
 * MapUtility class is a helper object for handling map
 * related functionality. You can use static functions directly
 * to handle certain functionality.
 */

import { getSearchParam } from './index';

/**
 * Get bbox from given bounds. By default, this uses
 * latLng format you can reverse by setting reverse true
 * @param {*} bounds - Leaflet bounds object
 * @param {boolean} reverse - Set true to reverse to LngLat format
 */
const getBboxFromBounds = (bounds, reverse = false) => {
  let bbox;
  if (reverse) {
    bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
  } else {
    bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
  }
  return bbox;
};

const isFloat = (val) => {
  const floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
  if (!floatRegex.test(val)) {
    return false;
  }

  const parsed = parseFloat(val);
  return !Number.isNaN(parsed);
};

/**
 * Parse bbox array from location if it is valid
 * @param location
 * @returns bbox array if valid bbox
 */
const parseBboxFromLocation = (location) => {
  const isValidBboxString = (bb) => {
    const parts = bb?.split(',');
    if (parts?.length !== 4) {
      return false;
    }
    return parts.every((part) => isFloat(part));
  };

  const bbox = getSearchParam(location, 'bbox');
  return isValidBboxString(bbox) ? bbox.split(',') : undefined;
};

const mapHasMapPane = (leafLetMap) => {
  // `getCenter()` call requires existence of mapPane (what ever that means). So check for that
  // before calling it. Just another null check.
  const panes = leafLetMap.getPanes();
  return !!panes && !!panes.mapPane;
};

const getCoordinatesFromUrl = (location) => {
  // Attempt to get coordinates from URL
  const usp = new URLSearchParams(location.search);
  const lat = usp.get('lat');
  const lng = usp.get('lon');
  if (!lat || !lng) {
    return null;
  }
  return [lat, lng];
};

const swapCoordinates = (coordinates) => [coordinates[1], coordinates[0]];

const coordinateIsActive = (location) => {
  try {
    return !!getCoordinatesFromUrl(location);
  } catch (e) {
    console.warn('Unable to get coordinate from URL.');
  }
  return false;
};

export {
  coordinateIsActive,
  getBboxFromBounds,
  getCoordinatesFromUrl,
  mapHasMapPane,
  parseBboxFromLocation,
  swapCoordinates,
};
