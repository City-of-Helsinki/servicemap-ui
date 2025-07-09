import { focusDistrict, focusToPosition } from './mapActions';

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

    const { geometry, location } = unit;
    const allowedGeometries = ['MultiLineString', 'MultiPolygon'];

    if (geometry && allowedGeometries.includes(geometry.type)) {
      switch (geometry.type) {
        case 'MultiLineString':
          focusDistrict(this.leaflet, [geometry.coordinates]);
          break;
        case 'MultiPolygon':
          focusDistrict(this.leaflet, geometry.coordinates);
          break;
        default:
      }
    } else if (location) {
      const unitZoomLevel = this.leaflet.options.unitZoom;
      const currentZoom = this.leaflet.getZoom();
      const targetZoom =
        currentZoom < unitZoomLevel ? unitZoomLevel : currentZoom;
      focusToPosition(this.leaflet, location.coordinates, targetZoom);
    }
  };

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
  };
}

export default MapUtility;
