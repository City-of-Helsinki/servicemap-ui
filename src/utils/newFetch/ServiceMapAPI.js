import config from '../../../config';
import HttpClient, { APIFetchError } from './HTTPClient';

export default class ServiceMapAPI extends HttpClient {
  constructor() {
    console.log('ServiceMapAPI baseURL', config.serviceMapAPI.root)
    if (
      typeof config?.serviceMapAPI?.root === 'string'
      && config.serviceMapAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError('ServicemapAPI baseURL missing');
    }
    super(config.serviceMapAPI.root);
  }

  search = async (query) => {
    console.log('Search endpoint')

    const options = {
      page: 1,
      page_size: 200,
      only: 'unit.street_address,unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count,unit.contract_type',
      geometry: true,
      include: 'unit.department',
      q: query
    };

    return await this.get('search', options);
  }

  serviceNames = async (idList) => {
    console.log('Service node endpoint')
    if (typeof idList !== 'string') {
      throw new APIFetchError('Invalid idList string provided to ServiceMapAPI serviceNames method');
    }
    const options = {
      id: idList,
      page: '1',
      page_size: '1000',
    }
    return this.get('service_node', options);
  }
}
