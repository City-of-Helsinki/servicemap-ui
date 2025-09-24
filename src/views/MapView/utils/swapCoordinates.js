/* eslint-disable global-require */
// This changes list of coordinates from lng-lat to lat-lng
const swapCoordinates = (data) => {
  // Return early on server side
  if (typeof window === 'undefined') {
    return data;
  }

  const L = require('leaflet');
  const coordinates = data;
  for (let i = 0; i < data.length; i += 1) {
    const geoJSONBounds = [];
    data[i].forEach((coordinate) => {
      const geoJSONCoord = L.GeoJSON.coordsToLatLng(coordinate);
      if (coordinate[0] < coordinate[1]) {
        geoJSONBounds.push([geoJSONCoord.lat, geoJSONCoord.lng]);
      } else {
        geoJSONBounds.push([geoJSONCoord.lng, geoJSONCoord.lat]);
      }
    });
    coordinates[i] = geoJSONBounds;
  }
  return coordinates;
};

export default swapCoordinates;
