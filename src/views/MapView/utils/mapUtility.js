import { focusToPosition, focusDistrict } from './mapActions';


const panOptions = {
  padding: [200, 200],
};

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

  panInside = (unit) => {
    if (!unit) {
      throw Error('Invalid unit given to MapUtility panInside');
    }
    const { location } = unit;
    if (location) {
      const coords = location.coordinates;
      // Pan to swapped coordinates
      this.leaflet.panInside([coords[1], coords[0]], panOptions);
    }
  }
}

export default MapUtility;
