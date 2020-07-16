/* eslint-disable no-param-reassign */
import config from '../../../config';

const URI = require('URIjs');

const { SUBDOMAINS } = config;

const data = {
  DOMAIN: null,
  SUBDOMAINS,
  LANGUAGE: {
    palvelukartta: 'fi',
    servicekarta: 'sv',
    servicemap: 'en',
  },
  LANGUAGES: {
    en: 'english',
    sv: 'svenska',
    fi: 'suomi',
  },
  BACKGROUND_MAPS: ['servicemap', 'ortographic', 'accessible_map'],
  DEFAULT_IFRAME_PROPERTIES: {
    style: {
      width: '100%',
      height: '100%',
    },
    frameBorder: 0,
  },
  DEFAULT_CUSTOM_WIDTH: '400',
  BASE_URL: '/embedder',
};

const joinQueries = (query) => {
  const data = query;
  Object.keys(query).forEach((key) => {
    const val = query[key];
    if (val instanceof Array) {
      data[key] = val.join(',');
    }
  });
  return data;
};

export const explode = (url) => {
  const uri = URI(url);
  const path = uri.segment();
  if (path[0] === 'embed' || path[0] === 'embedder') {
    path.shift();
  }
  let resource = path[0];
  let id = path.slice(1);
  let language = data.LANGUAGE[uri.subdomain().split('.')[0]];
  const query = uri.search(true);
  if (!(language && language.length > 0)) {
    if (uri.hostname() === 'localhost') {
      language = 'fi';
    } else {
      throw new ReferenceError(`Unknown subdomain in ${uri.host()}`);
    }
  }
  if (resource === '') {
    resource = null;
  }
  if (id.length < 1) {
    id = null;
  }
  return {
    id,
    language,
    resource,
    query,
  };
};

export const transform = (url, {
  language: lang,
  query,
}) => {
  const uri = URI(url);
  if (lang != null) {
    if (data.SUBDOMAINS_REST !== null) {
      uri.subdomain(`${data.SUBDOMAINS[lang]}.${data.SUBDOMAINS_REST}`);
    } else {
      uri.subdomain(data.SUBDOMAINS[lang]);
    }
  }
  if (query != null) {
    delete query.ratio;
    if (query.bbox == null) {
      delete query.bbox;
    }
    if (query.map != null) {
      if (query.map === 'servicemap') {
        delete query.map;
      }
    }
    if (query.city != null) {
      if (query.city === 'all') {
        delete query.city;
      }
    }
    uri.search(joinQueries(query));
  }
  return uri.toString();
};

export const strip = (url, parameters) => {
  if (parameters.resource == null) {
    return url;
  }
  if (parameters.query.bbox != null) {
    delete parameters.query.bbox;
  }
  const uri = URI(url);
  const query = uri.search(true);
  if (query.bbox != null) {
    delete query.bbox;
  }
  uri.search(query);
  return uri.toString();
};

// const IE_FAULTY_URL = /#(.*[\/\?].*)+$/;

/**
 * Verify url and return correct url or false if invalid
 * @param {*} url
 */
export const verify = (url) => {
  const uri = URI(url);
  const domain = uri.domain();
  const host = uri.hostname();
  const query = uri.search(true);
  const { ratio } = query;
  delete query.ratio;
  // Replace /embedder/ from url to have actual target url
  let directory = uri.directory();
  directory = directory.replace(data.BASE_URL, '/embed');
  uri.directory(directory);
  uri.search(query);

  // For testing on localhost
  if (host.match(/^localhost/)) {
    uri.port('2048');
    return {
      url: uri.toString(),
      ratio,
    };
  }

  // Verify that subdomain is one of allowed
  let result = false;
  Object.keys(data.SUBDOMAINS).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(data.SUBDOMAINS, key)) {
      return;
    }
    const subdomain = data.SUBDOMAINS[key];
    if (host === `${subdomain}.${domain}`) {
      result = uri.toString();
    }
  });

  return {
    url: result,
    ratio,
  };
};
