import { focusToPosition, focusDistrict } from './mapActions';


class MapUtility {
  constructor(props) {
    if (!props.leaflet) {
      throw Error('MapUtility requires leaflet element as option');
    }
    this.leaflet = props.leaflet;
  }

  leaflet;

  centerMapToUnit = (unit) => {
    if (!unit || !unit.id) {
      throw Error('centerMapToUnit requires valid unit to center');
    }

    if (unit && this.leaflet) {
      const { geometry, location } = unit;
      if (geometry && geometry.type === 'MultiLineString') {
        focusDistrict(this.leaflet, [geometry.coordinates]);
      } else if (location) {
        focusToPosition(this.leaflet, location.coordinates);
      }
    }
  }
}

export default MapUtility;
