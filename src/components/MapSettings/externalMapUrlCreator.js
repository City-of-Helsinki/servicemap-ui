class ExternalMapUrlCreator {
  /**
   *
   * @param lng given by (leaflet) map.getCenter()
   * @param lat given by (leaflet) map.getCenter()
   * @param zoom given by (leaflet) map.getZoom()
   * @param lang locale in what the map should be opened
   * @returns url to kartta.hel.fi/3d
   */
  static create3DMapUrl(lng, lat, zoom, lang) {
    const exponent = 3 - zoom;
    const distance = 52800 * (2 ** exponent);
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
