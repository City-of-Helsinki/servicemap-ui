
import config from '../../../config';

// *****************
// CONFIGURATIONS
// *****************
// API handlers
export const APIHandlers = {
  accessibilitySentences: {
    url: id => `${config.accessibilitySentenceAPI.root}/` + (config.usePtvAccessibilityApi ? `${id}/sentences/` : `unit/${id}`),
    options: {},
  },
  address: {
    url: `${config.serviceMapAPI.root}/address/`,
    options: {
      page_size: 5,
    },
  },
  district: {
    url: `${config.serviceMapAPI.root}/administrative_division/`,
    options: {
      geometry: true,
    },
  },
  reservations: {
    url: `${config.reservationsAPI.root}/resource/`,
    options: {
      page_size: 5,
    },
  },
  search: {
    url: `${config.serviceMapAPI.root}/search/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count,unit.contract_type',
      geometry: true,
    },
  },
  service: {
    url: id => `${config.serviceMapAPI.root}/service/${id}/`,
    options: {},
  },
  serviceRedirect: {
    url: `${config.serviceMapAPI.root}/redirect/unit/`,
    options: {},
  },
  unit: {
    url: id => `${config.serviceMapAPI.root}/unit/${id}/`,
    options: {
      accessibility_description: true,
      include: 'service_nodes,services',
      geometry: true,
    },
  },
  units: {
    url: `${config.serviceMapAPI.root}/unit/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'location,name,municipality,accessibility_shortcoming_count,service_nodes,contract_type',
      geometry: true,
      include: 'service_nodes,services,accessibility_properties',
    },
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
  },
  event: {
    url: id => `${config.eventsAPI.root}/event/${id}/`,
    options: {},
  },
  hearingMaps: {
    url: id => `${config.hearingMapAPI.root}/${id}`,
  },
};

export default APIHandlers;
