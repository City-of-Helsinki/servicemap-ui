
import config from '../../../config';

// *****************
// CONFIGURATIONS
// *****************
// API handlers
export const APIHandlers = {
  accessibilitySentences: {
    url: id => `${config.accessibilitySentenceAPI.root}/unit/${id}`,
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
    options: {},
  },
  search: {
    url: `${config.serviceMapAPI.root}/search/`,
    options: {
      page: 1,
      page_size: 200,
      only: 'unit.location,unit.name,unit.municipality,unit.accessibility_shortcoming_count',
      geometry: true,
    },
  },
  service: {
    url: id => `${config.serviceMapAPI.root}/service/${id}/`,
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
      page_size: 100,
    },

  },
  unitEvents: {
    url: `${config.eventsAPI.root}/event/`,
    options: {
      type: 'event',
      start: 'today',
      sort: 'start_time',
      include: 'location',
    },
  },
  event: {
    url: id => `${config.eventsAPI.root}/event/${id}/`,
    options: {},
  },
};

export default APIHandlers;
