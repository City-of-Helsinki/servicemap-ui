
import config from '../../../config';

// *****************
// CONFIGURATIONS
// *****************
// API handlers
export const APIHandlers = {
  accessibilitySentences: {
    url: id => `${config.accessibilitySentenceAPI.root}/${config.usePtvAccessibilityApi ? `${id}/sentences/` : `unit/${id}`}`,
    options: {},
    envName: config.accessibilitySentenceAPI.id,
  },
  address: {
    url: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/address/`,
    options: {
      page_size: 5,
    },
    envName: config.serviceMapAPI.id,
  },
  district: {
    url: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/administrative_division/`,
    options: {
      geometry: true,
    },
    envName: config.serviceMapAPI.id,
  },
  reservations: {
    url: `${config.reservationsAPI.root}/resource/`,
    options: {
      page_size: 5,
    },
    envName: config.serviceMapAPI.id,
  },
  search: {
    url: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/search/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'unit.street_address,unit.location,unit.name,unit.municipality,unit.contract_type,unit.phone,unit.call_charge_info,unit.email,unit.www,unit.connections,unit.picture_url',
      geometry: true,
      include: 'unit.department',
    },
    envName: config.serviceMapAPI.id,
  },
  service: {
    url: id => `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/service/${id}/`,
    options: {},
    envName: config.serviceMapAPI.id,
  },
  serviceRedirect: {
    url: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/redirect/unit/`,
    options: {},
    envName: config.serviceMapAPI.id,
  },
  unit: {
    url: id => `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/unit/${id}/`,
    options: {
      accessibility_description: true,
      include: 'services,keywords,department,entrances',
      geometry: true,
      geometry_3d: true,
    },
    envName: config.serviceMapAPI.id,
  },
  units: {
    url: `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/unit/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'street_address,location,name,municipality,accessibility_shortcoming_count,contract_type',
      geometry: true,
      include: 'services,accessibility_properties,department',
    },
    envName: config.serviceMapAPI.id,
  },
  idFetch: {
    url: type => `${config.serviceMapAPI.root}${config.serviceMapAPI.version}/${type}/`,
    options: {
      page: 1,
      page_size: 500,
      only: 'id',
    },
    envName: config.serviceMapAPI.id,
  },
  unitEvents: {
    url: `${config.eventsAPI.root}/event/`,
    options: {
      page_size: 5,
      type: 'event',
      start: 'today',
      sort: 'end_time',
      include: 'location',
    },
    envName: config.eventsAPI.id,
  },
  event: {
    url: id => `${config.eventsAPI.root}/event/${id}/`,
    options: {},
    envName: config.eventsAPI.id,
  },
  events: {
    url: `${config.eventsAPI.root}/event/`,
    options: {
      type: 'event',
      page: 1,
      page_size: 100,
      include: 'location,location.id',
      start: 'today',
      sort: 'end_time',
    },
    envName: config.eventsAPI.id,
  },
  hearingMaps: {
    url: id => `${config.hearingMapAPI.root}/${id}`,
    envName: config.hearingMapAPI.id,
  },
};

export default APIHandlers;
