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
    generate: data => `/unit/${data.id || ''}${data.type ? '/' + data.type : ''}${data.query || ''}`,
    regex: /\/[a-zA-Z]{2}\/unit\/([0-9]+)/
  },
  service: {
    generate: id => `/service/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/service\/([0-9]+)/
  },
  embed: {
    regex: /\/[a-zA-Z]{2}\/embed\/*/,
  },
  event: {
    generate: id => `/event/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/event\/([a-z:0-9]+)/
  },
  address: {
    generate: data => `/address/${data.municipality}/${data.street}/${data.number}${data.query || ''}`,
    regex: /\/[a-zA-Z]{2}\/address\/([a-zA-Z]+)\/([a-zA-Z])+\/([a-z:0-9]+)/
  },
}

export default paths;
