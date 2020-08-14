const URI = require('urijs');

export const getEmbedURL = (url, params = {}) => {
  if (!url) {
    return false;
  }
  const uri = URI(url);

  const segment = uri.segment();
  const data = uri.search(true); // Get data object of search parameters

  if (params.map && params.map !== 'servicemap') {
    data.map = params.map;
  }
  if (params.city && params.city !== 'all') {
    data.city = params.city;
  }
  if (params.service && params.service !== 'none') {
    data.level = params.service;
  }
  if (data.q && params.defaultLanguage) {
    data.search_language = params.defaultLanguage;
  }

  uri.search(data);

  if (params.language) {
    segment.splice(0, 1, params.language);
  }
  uri.segment(segment);
  return URI.decode(uri);
};

export const getLanguage = (url) => {
  if (!url) {
    return null;
  }
  const uri = URI(url);
  const segment = uri.segment();
  return segment[0];
};
