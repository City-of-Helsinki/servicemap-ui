// Application paths
const paths = {
  home: {
    generate: () => '/',
    regex: /\/[a-zA-Z]{2}\/$/
  },
  map: {
    generate: () => `/map`,
    regex: /\/[a-zA-Z]{2}\/map/
  },
  search: {
    generate: query => `/search${query ? `?q=${query}` : ''}`,
    regex: /\/[a-zA-Z]{2}\/search/
  },
  unit: {
    generate: id => `/unit/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/unit\/([0-9]+)/
  },
  unitFullList: {
    generate: data => `/unit/${data.id || ''}/${data.type}`,
    regex: /\/[a-zA-Z]{2}\/unit\/([0-9]+)\/[a-zA-Z]+/
  },
  service: {
    generate: id => `/service/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/service\/([0-9]+)/
  },
  event: {
    generate: id => `/event/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/event\/([a-z:0-9]+)/
  },
}

export default paths;
