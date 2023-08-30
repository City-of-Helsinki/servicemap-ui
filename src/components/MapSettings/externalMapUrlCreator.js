class ExternalMapUrlCreator {
  /**
   *
   * @param lng given by (leaflet) map.getCenter()
   * @param lat given by (leaflet) map.getCenter()
   * @param zoom given by (leaflet) map.getZoom()
   * @returns url to kartta.hel.fi/3d
   */
  static create3DMapUrl(lng, lat, zoom) {
    const exponent = 3 - zoom;
    const distance = 52800 * (2 ** exponent);
    // Leaflet zoom levels represent a zoom by power of 2. Magic number 52800 was calculated by
    // measuring Malmi runway with ruler and testing "distance" param until a fit was found.
    const aboveGround = 0;
    return `https://kartta.hel.fi/3d/?startingmap=Cesium Map&lang=en&cameraPosition=${lng},${lat},${distance + aboveGround}&groundPosition=${lng},${lat},${aboveGround}&distance=${distance}&pitch=-90.00&heading=360.00&roll=0.00#/`;
  }
}

export default ExternalMapUrlCreator;
