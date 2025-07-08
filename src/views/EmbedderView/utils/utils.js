import URI from 'urijs';

export const getEmbedURL = (url, params = {}) => {
  if (!url) {
    return undefined;
  }
  const uri = URI(url);

  const segment = uri.segment();
  const data = uri.search(true); // Get data object of search parameters
  if (params.map) {
    data.map = params.map;
  }
  if (params.city?.length > 0) {
    data.city = params.city.join(',');
  } else {
    delete data.city;
  }
  if (params.organization?.length > 0) {
    data.organization = params.organization.map((org) => org.id).join(',');
  } else {
    delete data.organization;
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
  if (params.showUnitList && params.showUnitList !== 'none') {
    data.show_list = params.showUnitList;
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

export const setBboxToUrl = (url, bbox) => {
  if (!url) {
    return undefined;
  }
  const uri = URI(url);

  const data = uri.search(true); // Get data object of search parameters
  if (bbox) {
    data.bbox = bbox;
  } else {
    delete data.bbox;
  }
  uri.search(data);
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
