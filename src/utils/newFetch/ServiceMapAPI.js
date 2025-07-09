import config from '../../../config';
import { isEmbed } from '../path';
import HttpClient, { APIFetchError, serviceMapAPIName } from './HTTPClient';

export default class ServiceMapAPI extends HttpClient {
  constructor() {
    if (
      typeof config?.serviceMapAPI?.root !== 'string' ||
      typeof config?.serviceMapAPI?.version !== 'string' ||
      (typeof config?.serviceMapAPI?.root === 'string' &&
        config.serviceMapAPI.root.indexOf('undefined') !== -1) ||
      (typeof config?.serviceMapAPI?.version === 'string' &&
        config.serviceMapAPI.version.indexOf('undefined') !== -1)
    ) {
      throw new APIFetchError('ServicemapAPI baseURL missing');
    }
    super(
      `${config.serviceMapAPI.root}${config.serviceMapAPI.version}`,
      serviceMapAPIName
    );
  }

  /**
   * Searches by coordinates and returns the closest by distance.
   * @param lat
   * @param lon
   * @returns {Promise<void>}
   */
  addressByCoordinates = async (lat, lon) => {
    const results = await this.getSinglePage('address', {
      lat,
      lon,
      page: 1,
      page_size: 5,
    });
    const ordered = results
      .map((x) => x)
      .sort((x, y) => x.distance - y.distance);
    return ordered.find((x) => x); // first
  };

  search = async (query, additionalOptions) => {
    if (typeof query !== 'string') {
      throw new APIFetchError(
        'Invalid query string provided to ServiceMapAPI search method'
      );
    }
    const options = {
      // TODO: adjust these values for best results and performance
      q: query,
      page_size: 400,
      limit: 2500,
      unit_limit: 2500,
      service_limit: 500,
      address_limit: 700,
      administrativedivision_limit: 1,
      include: 'unit.organizer_type',
      ...additionalOptions,
    };

    return this.getConcurrent('search', options);
  };

  searchSuggestions = async (query, additionalOptions) => {
    if (typeof query !== 'string') {
      throw new APIFetchError(
        'Invalid query string provided to ServiceMapAPI search method'
      );
    }
    const options = {
      q: query,
      limit: 2500,
      administrativedivision_limit: 1,
      ...additionalOptions,
    };

    return this.getSinglePage('search', options);
  };

  serviceNodeSearch = async (variant, idList, additionalOptions, onlyCount) => {
    if (!['string', 'number'].includes(typeof idList)) {
      throw new APIFetchError(
        'Invalid query string provided to ServiceMapAPI serviceNodeSearch method'
      );
    }

    let onlyValues = [
      'street_address',
      'location',
      'name',
      'municipality',
      'accessibility_shortcoming_count',
      'contract_type',
      'organizer_type',
    ];
    if (isEmbed())
      onlyValues = [
        ...onlyValues,
        'connections',
        'phone',
        'call_charge_info',
        'email',
        'www',
        'address_zip',
      ];

    const idOptions =
      variant === 'ServiceTree'
        ? { service_node: idList }
        : { mobility_node: idList };
    const options = {
      page: 1,
      page_size: 200,
      only: onlyValues,
      geometry: true,
      ...idOptions,
      ...additionalOptions,
      include:
        'services,accessibility_properties,department,root_department'.split(
          ','
        ),
    };

    if (additionalOptions.include) {
      options.include.push(...additionalOptions.include);
    }

    if (onlyCount) {
      return this.getCount('unit', options);
    }
    return this.getConcurrent('unit', options);
  };

  serviceUnitSearch = async (serviceId, additionalOptions) => {
    if (typeof serviceId !== 'string') {
      throw new APIFetchError(
        'Invalid id string provided to ServiceMapAPI serviceUnits method'
      );
    }

    let onlyValues = [
      'street_address',
      'location',
      'name',
      'municipality',
      'accessibility_shortcoming_count',
      'contract_type',
      'organizer_type',
      'department',
      'root_department',
    ];
    if (isEmbed())
      onlyValues = [
        ...onlyValues,
        'connections',
        'phone',
        'call_charge_info',
        'email',
        'www',
        'address_zip',
      ];

    const options = {
      service: serviceId,
      page: 1,
      page_size: 200,
      only: onlyValues,
      geometry: true,
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
  };

  // Fetch units of multiple services concurrently
  serviceUnits = async (idList, additionalOptions) => {
    if (typeof idList !== 'string' && typeof idList !== 'number') {
      throw new APIFetchError(
        'Invalid idList string provided to ServiceMapAPI services method'
      );
    }

    const options = {
      service: idList,
      page_size: 200,
      geometry: true,
      only: [
        'street_address',
        'phone',
        'call_charge_info',
        'email',
        'www',
        'name',
        'accessibility_shortcoming_count',
        'location',
        'municipality',
        'contract_type',
        'connections',
        'picture_url',
        'organizer_type',
        'address_zip',
      ].join(','),
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
  };

  serviceNames = async (idList) => {
    if (typeof idList !== 'string') {
      throw new APIFetchError(
        'Invalid idList string provided to ServiceMapAPI serviceNames method'
      );
    }
    const options = {
      id: idList,
      page: '1',
      page_size: '1000',
    };
    return this.get('service_node', options);
  };

  // Fetch list of all services
  services = async () => {
    const options = {
      page: '1',
      page_size: '500',
    };
    return this.getConcurrent('service', options);
  };

  statisticalGeometry = async () => {
    const options = {
      page: 1,
      page_size: 500,
      geometry: true,
      type: 'statistical_district',
    };
    return this.getConcurrent('administrative_division', options);
  };

  areas = async (idList, geometry, additionalOptions) => {
    if (typeof idList !== 'string') {
      throw new APIFetchError(
        'Invalid idList string provided to ServiceMapAPI areas method'
      );
    }
    const options = {
      type: idList,
      page: 1,
      page_size: '500',
      geometry: !!geometry,
      ...additionalOptions,
    };
    return this.getConcurrent('administrative_division', options);
  };

  areaGeometry = async (id, additionalOptions) => {
    if (typeof id !== 'string') {
      throw new APIFetchError(
        'Invalid id string provided to ServiceMapAPI areaGeometry method'
      );
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
  };

  areaUnits = async (nodeID) => {
    if (typeof nodeID !== 'string') {
      throw new APIFetchError(
        'Invalid nodeID string provided to ServiceMapAPI area unit fetch method'
      );
    }

    const onlyValues = [
      'street_address',
      'location',
      'name',
      'municipality',
      'accessibility_shortcoming_count',
      'contract_type',
      'department',
      'root_department',
    ];
    if (isEmbed()) {
      onlyValues.push(
        ...[
          'connections',
          'phone',
          'call_charge_info',
          'email',
          'www',
          'address_zip',
        ]
      );
    }

    const options = {
      page: 1,
      page_size: 200,
      division: nodeID,
      only: onlyValues,
      include: 'services',
    };

    return this.getConcurrent('unit', options);
  };

  parkingAreaInfo = async (params) => {
    const options = {
      page: 1,
      page_size: 1,
      type: 'parking_area',
      geometry: false,
      ...params,
    };

    return this.getSinglePage('administrative_division', options);
  };

  units = async (additionalOptions) => {
    let onlyValues = [
      'street_address',
      'location',
      'name',
      'municipality',
      'accessibility_shortcoming_count',
      'contract_type',
      'organizer_type',
    ];
    if (isEmbed())
      onlyValues = [
        ...onlyValues,
        'connections',
        'phone',
        'call_charge_info',
        'email',
        'www',
        'address_zip',
      ];

    const options = {
      page_size: 200,
      only: onlyValues,
      include: 'services,accessibility_properties,department',
      geometry: true,
      ...additionalOptions,
    };

    return this.getConcurrent('unit', options);
  };

  sendStats = async (data) => {
    if (
      typeof data.embed === 'undefined' ||
      typeof data.mobile_device === 'undefined'
    ) {
      throw new APIFetchError(
        'Invalid data provided for ServiceMapAPI sendStats fetch method'
      );
    }
    if (
      typeof config?.serviceMapAPI?.root === 'string' &&
      config.serviceMapAPI.root.indexOf('undefined') !== -1
    ) {
      throw new APIFetchError(
        'ServicemapAPI missing serviceMapAPI root url in sendStats fetch'
      );
    }

    const baseUrlOverride = config.serviceMapAPI.root;

    const urlOverride =
      baseUrlOverride.substring(baseUrlOverride.length - 1) === '/'
        ? baseUrlOverride.substring(0, baseUrlOverride.length - 1)
        : baseUrlOverride;
    return this.post('stats', data, urlOverride);
  };
}
