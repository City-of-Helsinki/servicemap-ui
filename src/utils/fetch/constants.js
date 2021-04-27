
import config from '../../../config';

// *****************
// CONFIGURATIONS
// *****************
// API handlers
export const APIHandlers = {
  accessibilitySentences: {
    url: id => `${config.accessibilitySentenceAPI.root}/` + (config.usePtvAccessibilityApi ? `${id}/sentences/` : `unit/${id}`),
    options: {},
    envName: config.accessibilitySentenceAPI.id,
  },
  address: {
    url: `${config.serviceMapAPI.root}/address/`,
    options: {
      page_size: 5,
    },
    envName: config.serviceMapAPI.id,
  },
  district: {
    url: `${config.serviceMapAPI.root}/administrative_division/`,
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
    url: `${config.serviceMapAPI.root}/search/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'unit.street_address,unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count,unit.contract_type',
      geometry: true,
      include: 'unit.department',
    },
    envName: config.serviceMapAPI.id,
  },
  service: {
    url: id => `${config.serviceMapAPI.root}/service/${id}/`,
    options: {},
    envName: config.serviceMapAPI.id,
  },
  serviceRedirect: {
    url: `${config.serviceMapAPI.root}/redirect/unit/`,
    options: {},
    envName: config.serviceMapAPI.id,
  },
  unit: {
    url: id => `${config.serviceMapAPI.root}/unit/${id}/`,
    options: {
      accessibility_description: true,
      include: 'service_nodes,services,keywords,department,entrances',
      geometry: true,
    },
    envName: config.serviceMapAPI.id,
  },
  units: {
    url: `${config.serviceMapAPI.root}/unit/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'street_address,location,name,municipality,accessibility_shortcoming_count,service_nodes,contract_type',
      geometry: true,
      include: 'service_nodes,services,accessibility_properties,department',
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
  hearingMaps: {
    url: id => `${config.hearingMapAPI.root}/${id}`,
    envName: config.hearingMapAPI.id,
  },
};

export default APIHandlers;
