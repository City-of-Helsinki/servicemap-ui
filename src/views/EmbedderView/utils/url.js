/* eslint-disable no-param-reassign */
import URI from 'urijs';

import embedderConfig from '../embedderConfig';

const explode = (url) => {
  const uri = URI(url);
  const path = uri.segment();
  const language = path[0];
  path.shift();
  if (path[0] === 'embed' || path[0] === 'embedder') {
    path.shift();
  }
  let resource = path[0];
  let id = path.slice(1);
  const query = uri.search(true);

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

// Removes query params p and bbox
export const strip = (url) => {
  const uri = URI(url);
  const parameters = explode(url);
  const query = uri.search(true);
  if (query.p != null) {
    delete query.p;
  }
  if (parameters.resource != null) {
    if (query.bbox != null) {
      delete query.bbox;
    }
  }

  uri.search(query);
  return uri.toString();
};

/**
 * Verify url and return correct url or false if invalid
 * @param {*} url
 */
export const verify = (url) => {
  const uri = URI(url);
  const host = uri.hostname();
  const query = uri.search(true);
  const { ratio } = query;
  delete query.ratio;
  // Replace /embedder/ from url to have actual target url
  let directory = uri.directory();
  directory = directory.replace(embedderConfig.BASE_URL, '/embed');
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

  return {
    url: uri.toString(),
    ratio,
  };
};
