/**
 * MapUtility class is a helper object for handling map
 * related functionality. You can use static functions directly
 * to handle certain functionality.
 */

/**
 * Get bbox from given bounds. By default this uses
 * latLng format you can revese by setting reverse true
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

const mapHasMapPane = (leafLetMap) => {
  // `getCenter()` call requires existence of mapPane (what ever that means). So check for that
  // before calling it. Just another null check.
  const panes = leafLetMap.getPanes();
  return !!panes && !!panes.mapPane;
};

export {
  getBboxFromBounds,
  mapHasMapPane,
};
