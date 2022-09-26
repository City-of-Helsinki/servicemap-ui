import config from '../../../config';
import HttpClient, { APIFetchError, serviceMapAPIName } from './HTTPClient';

export default class ServiceMapAPI extends HttpClient {
  constructor() {
    if (
      typeof config?.serviceMapAPI?.root === 'string'
      && config.serviceMapAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError('ServicemapAPI baseURL missing');
    }
    super(config.serviceMapAPI.root, serviceMapAPIName);
  }

  search = async (query, additionalOptions) => {
    if (typeof query !== 'string') {
      throw new APIFetchError('Invalid query string provided to ServiceMapAPI search method');
    }
    const options = { // TODO: adjust these values for best results and performance
      q: query,
      page_size: 400,
      limit: 2500,
      unit_limit: 2500,
      service_limit: 500,
      address_limit: 700,
      administrativedivision_limit: 1,
      ...additionalOptions,
    };

    return this.getConcurrent('search', options);
  }

  searchSuggestions = async (query, additionalOptions) => {
    if (typeof query !== 'string') {
      throw new APIFetchError('Invalid query string provided to ServiceMapAPI search method');
    }
    const options = {
      q: query,
      limit: 2500,
      administrativedivision_limit: 1,
      ...additionalOptions,
    };

    return this.getSinglePage('search', options);
  }

  serviceNodeSearch = async (idList, additionalOptions) => {
    if (typeof idList !== 'string') {
      throw new APIFetchError('Invalid query string provided to ServiceMapAPI search method');
    }
    const options = {
      page: 1,
      page_size: 200,
      only: 'street_address,location,name,municipality,accessibility_shortcoming_count,service_nodes,contract_type',
      geometry: true,
      include: 'service_nodes,services,accessibility_properties,department',
      service_node: idList,
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
  }

  serviceUnitSearch = async (serviceId, additionalOptions) => {
    if (typeof serviceId !== 'string') {
      throw new APIFetchError('Invalid id string provided to ServiceMapAPI serviceUnits method');
    }

    const options = {
      service: serviceId,
      page: 1,
      page_size: 200,
      only: 'street_address,name,accessibility_shortcoming_count,location,municipality,contract_type',
      geometry: true,
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
  }

  // Fetch units of multiple services concurrently
  serviceUnits = async (idList, additionalOptions) => {
    if (typeof idList !== 'string' && typeof idList !== 'number') {
      throw new APIFetchError('Invalid idList string provided to ServiceMapAPI services method');
    }

    const options = {
      service: idList,
      page_size: 200,
      geometry: true,
      only: 'street_address,phone,call_charge_info,email,www,name,accessibility_shortcoming_count,location,municipality,contract_type,connections,picture_url',
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
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

  areas = async (idList, geometry, additionalOptions) => {
    if (typeof idList !== 'string') {
      throw new APIFetchError('Invalid idList string provided to ServiceMapAPI areas method');
    }
    const options = {
      type: idList,
      page: 1,
      page_size: '500',
      geometry: !!geometry,
      ...additionalOptions,
    };
    return this.getConcurrent('administrative_division', options);
  }

  areaGeometry = async (id, additionalOptions) => {
    if (typeof id !== 'string') {
      throw new APIFetchError('Invalid id string provided to ServiceMapAPI areaGeometry method');
    }
    const options = {
      type: id,
      page: 1,
      page_size: 500,
      geometry: true,
      unit_include: 'name,location,street_address,address_zip,municipality',
      ...additionalOptions,
    };
    return this.getConcurrent('administrative_division', options);
  }

  areaUnits = async (nodeID, progressCallback) => {
    if (typeof nodeID !== 'string') {
      throw new APIFetchError('Invalid nodeID string provided to ServiceMapAPI area unit fetch method');
    }

    const options = {
      page: 1,
      page_size: 200,
      division: nodeID,
      only: 'street_address,location,name,municipality,accessibility_shortcoming_count,service_nodes,contract_type',
      include: 'services',
    };

    return this.getConcurrent('unit', options, progressCallback);
  }

  parkingAreaInfo = async (parkingID) => {
    if (typeof parkingID !== 'string') {
      throw new APIFetchError('Invalid parkingID string provided to ServiceMapAPI area unit fetch method');
    }
    const options = {
      page: 1,
      page_size: 1,
      type: 'parking_area',
      geometry: false,
      extra__class: parkingID,
    };

    return this.getSinglePage('administrative_division', options);
  }

  units = async (additionalOptions) => {
    const options = {
      page_size: 200,
      only: 'street_address,location,name,municipality,accessibility_shortcoming_count,service_nodes,contract_type',
      include: 'service_nodes,services,accessibility_properties,department',
      geometry: true,
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
  }
}
