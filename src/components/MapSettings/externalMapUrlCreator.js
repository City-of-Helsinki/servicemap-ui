const calculateDistance = (mapType, zoom) => {
  if (mapType === 'ortographic') {
    const exponent = 3 - zoom;
    return 52800 * (2 ** exponent);
  }
  if (mapType === 'servicemap') {
    const exponent = 16 - zoom;
    return 2000 * (2 ** exponent);
  }
  if (mapType === 'guideMap') {
    const exponent = 12 - zoom;
    return 3350 * (2 ** exponent);
  }
  if (mapType === 'accessible_map') {
    const exponent = 13 - zoom;
    return 16000 * (2 ** exponent);
  }
  return 0;
};

class ExternalMapUrlCreator {
  /**
   *
   * @param lng given by (leaflet) map.getCenter()
   * @param lat given by (leaflet) map.getCenter()
   * @param zoom given by (leaflet) map.getZoom()
   * @param mapType
   * @param lang locale in what the map should be opened
   * @returns url to kartta.hel.fi/3d
   */
  static create3DMapUrl(lng, lat, zoom, mapType, lang) {
    const distance = calculateDistance(mapType, zoom);
    // Leaflet zoom levels represent a zoom by power of 2. Magic number 52800 was calculated by
    // measuring Malmi runway with ruler and testing "distance" param until a fit was found.
    const aboveGround = 0;
    const params = new URLSearchParams();
    params.append('startingmap', 'Cesium Map');
    params.append('lang', lang);
    params.append('groundPosition', `${lng},${lat},${aboveGround}`);
    params.append('distance', `${distance}`);
    params.append('pitch', '-45.00');
    params.append('heading', '360.00');
    params.append('roll', '0.00');
    return `https://kartta.hel.fi/3d/?${params.toString()}`;
  }
}

export default ExternalMapUrlCreator;
