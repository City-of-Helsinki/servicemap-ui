import config from '../../config';

const allowedTypes = [
  'search',
  'unit',
];

const searchQueryData = {
  page: 1,
  page_size: 200,
  only: 'unit.root_service_nodes,unit.services,unit.location,unit.name,unit.street_address,unit.contract_type,unit.municipality',
  include: 'service_nodes,services',
  geometry: true,
};

const unitQueryData = {
  include: 'service_nodes,services',
};

class QueryBuilder {
  constructor() {
    const { unit } = config;
    this.url = unit && unit.api_url;
    this.defaultType = 'search';
    this.searchQuery = null;
    this.data = null;
  }

  // Set type of query
  setType = (type, data = null) => {
    // Check that type is valid
    if (allowedTypes.includes(type)) {
      this.type = type;
      this.data = data;
    } else {
      this.type = this.defaultType;
    }
    return this;
  }

  // Return query data object based on given type
  getQueryData = () => {
    switch (this.type) {
      case 'search':
        return searchQueryData;
      case 'unit':
        return unitQueryData;
      default:
        return searchQueryData;
    }
  }

  // Get base url
  getBase = () => this.url

  // Set query to search and add search text
  search = (search = null) => {
    this.setType('search');
    if (search && typeof search === 'string' && search.length > 0) {
      this.searchQuery = search;
    } else {
      this.searchQuery = null;
    }
    return this;
  }

  // Build query to a URL
  run = () => {
    let query = '';
    let fetchURL = null;
    let first = true;

    const data = this.getQueryData();

    if (data) {
      // Add search query to query data
      if (this.searchQuery && this.searchQuery !== '') {
        data.q = this.searchQuery;
      }

      Object.keys(data).forEach((item) => {
        if (first) {
          query += `${item}=${data[item]}`;
          first = false;
        } else {
          query += `&${item}=${data[item]}`;
        }
      });
    }

    switch (this.type) {
      case 'unit':
        fetchURL = `${this.url}${this.type}/${this.data}/?${encodeURI(query)}`;
        break;
      default:
        fetchURL = `${this.url}${this.type}/?${encodeURI(query)}`;
    }

    return fetch(fetchURL);
  }
}

export default new QueryBuilder();
