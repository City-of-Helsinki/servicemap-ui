const L =
  typeof window !== 'undefined' ? (await import('leaflet')).default : null;

// This changes list of coordinates from lng-lat to lat-lng
const swapCoordinates = (data) => {
  // Return early on server side
  if (typeof window === 'undefined') {
    return data;
  }

  if (!Array.isArray(data)) {
    return [];
  }

  const coordinates = [];
  for (const ring of data) {
    if (!Array.isArray(ring)) {
      continue;
    }
    const geoJSONBounds = [];
    ring.forEach((coordinate) => {
      if (
        !Array.isArray(coordinate) ||
        coordinate.length < 2 ||
        !Number.isFinite(coordinate[0]) ||
        !Number.isFinite(coordinate[1])
      ) {
        return;
      }
      const geoJSONCoord = L.GeoJSON.coordsToLatLng(coordinate);
      if (
        !geoJSONCoord ||
        !Number.isFinite(geoJSONCoord.lat) ||
        !Number.isFinite(geoJSONCoord.lng)
      ) {
        return;
      }
      if (coordinate[0] < coordinate[1]) {
        geoJSONBounds.push([geoJSONCoord.lat, geoJSONCoord.lng]);
      } else {
        geoJSONBounds.push([geoJSONCoord.lng, geoJSONCoord.lat]);
      }
    });
    if (geoJSONBounds.length >= 2) {
      coordinates.push(geoJSONBounds);
    }
  }
  return coordinates;
};

export default swapCoordinates;
