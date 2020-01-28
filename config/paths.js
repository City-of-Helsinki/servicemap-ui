// Application paths
const paths = {
  home: {
    generate: () => '/',
    regex: /\/[a-zA-Z]{2}\/$/
  },
  search: {
    // generate: data => `/search${data.query ? `?q=${data.query}` : ''}${data.service_node ? `?service_node=${data.service_node.join(',')}`: ''}`,
    generate: data => {
      const params = Object.keys(data).map(key => (`${key}=${data[key]}`));
      return `/search${params.length ? `?${params.join('&')}` : ''}`;
    },
    regex: /\/[a-zA-Z]{2}\/search/
  },
  unit: {
    generate: data => `/unit/${data.id || ''}${data.type ? '/' + data.type : ''}`,
    regex: /\/[a-zA-Z]{2}\/unit\/([0-9]+)/
  },
  service: {
    generate: id => `/service/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/service\/([0-9]+)/
  },
  serviceTree: {
    generate: () => `/services`,
    regex: /\/[a-zA-Z]{2}\/services/
  },
  embed: {
    regex: /\/[a-zA-Z]{2}\/embed\/*/,
  },
  event: {
    generate: id => `/event/${id || ''}`,
    regex: /\/[a-zA-Z]{2}\/event\/([a-z:0-9]+)/
  },
  address: {
    generate: data => `${data.embed ? '/embed/address/' : '/address/'}${data.municipality}/${data.street}/${data.number}`,
    regex: /\/[a-zA-Z]{2}\/address\/([a-zA-Z]+)\/([a-zA-Z])+\/([a-z:0-9]+)/
  },
  info: {
    generate: () => `/info`,
    regex: /\/[a-zA-Z]{2}\/info/
  },
  feedback: {
    generate: () => '/feedback',
    regex: /\/[a-zA-Z]{2}\/feedback/
  }
}

export default paths;
