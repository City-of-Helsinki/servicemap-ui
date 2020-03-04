import { getSearchParam } from '.';

class CustomLocation {
  coords = null;

  constructor(props) {
    try {
      const latLng = getSearchParam(props, 'latLng');
      this.coords = latLng ? latLng.split(',') : null;
    } catch (e) {
      throw Error(`Unable to initialize CustomLocation: ${e.message}`);
    }
  }
}

export default CustomLocation;
