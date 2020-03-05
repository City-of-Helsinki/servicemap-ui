import { getSearchParam } from '.';

class CustomLocation {
  coords = null;

  error = null;

  hideMarker = false;

  constructor(props) {
    try {
      const lat = getSearchParam(props, 'lat');
      const lon = getSearchParam(props, 'lon');
      const hideMarker = getSearchParam(props, 'hide_marker');
      if (hideMarker && (hideMarker === 'true' || hideMarker === '1')) {
        this.hideMarker = true;
      }
      if (lat && lon) {
        this.coords = [lat, lon];
        return;
      }
      throw Error('lat or lon coordinates missing');
    } catch (e) {
      this.error = Error(`Unable to initialize CustomLocation: ${e.message}`);
    }
  }
}

export default CustomLocation;
