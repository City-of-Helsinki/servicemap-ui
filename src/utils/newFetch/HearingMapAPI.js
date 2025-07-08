import config from '../../../config';
import HttpClient, { APIFetchError, hearingMapAPIName } from './HTTPClient';

export default class HearingMapAPI extends HttpClient {
  constructor() {
    if (
      typeof config?.hearingMapAPI?.root === 'string' &&
      config.hearingMapAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError('HearingMapAPI baseURL missing');
    }
    super(config.hearingMapAPI.root, hearingMapAPIName);
  }

  hearingMaps = async (unitID) => {
    if (typeof unitID !== 'string' && typeof unitID !== 'number') {
      throw new APIFetchError(
        'HearingMapAPI: Invalid unitID provided to hearingMaps fetch method'
      );
    }
    const options = {};

    return this.get(`${unitID}`, options);
  };
}
