import config from '../../../config';
import HttpClient, { APIFetchError } from './HTTPClient';

export default class ServiceMapAPI extends HttpClient {
  constructor() {
    if (
      typeof config?.serviceMapAPI?.root === 'string'
      && config.serviceMapAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError('ServicemapAPI baseURL missing');
    }
    super(config.serviceMapAPI.root);
  }

  search = async (query) => {
    if (typeof query !== 'string') {
      throw new APIFetchError('Invalid query string provided to ServiceMapAPI search method');
    }
    const options = {
      page: 1,
      page_size: 200,
      only: 'unit.street_address,unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count,unit.contract_type',
      geometry: true,
      include: 'unit.department',
      q: query,
    };

    return this.get('search', options);
  }

  serviceNames = async (idList) => {
    if (typeof idList !== 'string') {
      throw new APIFetchError('Invalid idList string provided to ServiceMapAPI serviceNames method');
    }
    const options = {
      id: idList,
      page: '1',
      page_size: '1000',
    };
    return this.get('service_node', options);
  }
}
