const URI = require('urijs');

export const getEmbedURL = (url, params = {}) => {
  if (!url) {
    return false;
  }
  const uri = URI(url);

  const segment = uri.segment();
  const data = uri.search(true); // Get data object of search parameters
  const cityObj = params.city;
  const cities = cityObj
    ? Object.keys(cityObj).reduce((acc, current) => {
      if (Object.prototype.hasOwnProperty.call(cityObj, current)) {
        if (cityObj[current]) {
          acc.push(current);
        }
      }
      return acc;
    }, []) : [];

  if (params.map && params.map !== 'servicemap') {
    data.map = params.map;
  }
  if (cities.length > 0) {
    data.city = cities.join(',');
  }
  if (params.service && params.service !== 'none') {
    data.level = params.service;
  }
  if (data.q && params.defaultLanguage) {
    data.search_language = params.defaultLanguage;
  }
  if (params.transit) {
    data.transit = params.transit ? 1 : 0;
  }
  if (params.showUnits === false) {
    data.units = 'none';
  }
  if (params.showList) {
    data.show_list = 'true';
  }
  if (params.bbox) {
    data.bbox = params.bbox;
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
