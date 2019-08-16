
import config from '../../../config';

// *****************
// CONFIGURATIONS
// *****************

// API handlers
export const APIHandlers = {
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
};

export default APIHandlers;
