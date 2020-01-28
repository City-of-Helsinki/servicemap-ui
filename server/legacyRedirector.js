import https from 'https';
import config from '../config';

let languageMap = {
  palvelukartta: 'fi',
  servicekarta: 'sv',
  servicemap: 'en'
};

let languageIdMap = {};
Object.keys(languageMap).forEach(key => {
  if (Object.prototype.hasOwnProperty.call(languageMap, key)) {
    const current = languageMap[key];
    languageIdMap[current] = key;
  }
});

const extractLanguage = function(req, isEmbed) {
  var language, value;
  language = 'fi';
  value = req.query.lang;
  if (value == null) {
    value = req.query.language;
  }
  if (value) {
    switch (value) {
      case 'se':
        language = 'sv';
        break;
      case 'sv':
        language = 'sv';
        break;
      case 'en':
        language = 'en';
    }
  }
  return {
    id: language,
    isAlias: false
  };
};

const extractServices = function(req) {
  var services;
  services = req.query.theme;
  if (!services) {
    return null;
  }
  services = services.split(' ');
  if (services.length < 1) {
    return null;
  }
  return services.join(',');
};

const extractStreetAddress = function(req, municipalityParameter) {
  var addressParts, addressString, municipality, numberIndex, numberPart, street, streetPart;
  addressParts = void 0;
  addressString = req.query.address || req.query.addresslocation;
  if (addressString === void 0) {
    return null;
  }
  addressParts = addressString.split(',');
  if (addressParts.length < 1) {
    return null;
  }
  municipality = void 0;
  if (addressParts.length === 2) {
    municipality = addressParts[1].trim();
  }
  if (municipality == null) {
    municipality = municipalityParameter;
  }
  streetPart = addressParts[0].trim();
  numberIndex = streetPart.search(/\d/);
  street = streetPart.substring(0, numberIndex).trim();
  numberPart = streetPart.substring(numberIndex);
  return {
    municipality: municipality != null ? municipality.toLowerCase() : void 0,
    street: street.toLowerCase().replace(/\s+/g, '+'),
    number: numberPart.toLowerCase()
  };
};

const extractMunicipality = function(req) {
  var municipality, region;
  municipality = req.query.city;
  region = req.query.region;
  if (region == null) {
    if (municipality) {
      region = municipality;
    } else {
      return null;
    }
  }
  switch (region.toLowerCase()) {
    case 'c91':
    case '91':
    case 'helsinki':
      return 'helsinki';
    case 'c49':
    case '49':
    case 'espoo':
      return 'espoo';
    case 'c92':
    case '92':
    case 'vantaa':
      return 'vantaa';
    case 'c235':
    case '235':
    case 'kauniainen':
      return 'kauniainen';
    case 'all':
      return '';
    default:
      return null;
  }
};

const extractSpecification = function(req) {
  var dig, language, specs;
  language = void 0;
  specs = {};
  dig = function(key) {
    return req.query[key] || null;
  };
  specs.originalPath = req.url.split('/').filter(function(s) {
    return s.length > 0;
  });
  if (specs.originalPath.indexOf('embed') >= 0) {
    specs.isEmbed = true;
  }
  if (specs.originalPath.indexOf('esteettomyys') >= 0 || specs.originalPath.indexOf('yllapito') >= 0) {
    specs.override = true;
    return specs;
  }
  specs.language = extractLanguage(req, specs.isEmbed);
  if (specs.language.isAlias === true) {
    return specs;
  }
  specs.unit = dig('id');
  specs.searchQuery = dig('search');
  specs.radius = dig('distance');
  specs.organization = dig('organization');
  specs.municipality = extractMunicipality(req);
  specs.services = extractServices(req);
  specs.address = extractStreetAddress(req, specs.municipality);
  if (specs.address !== null) {
    specs.serviceCategory = dig('service');
  }
  return specs;
};

const encodeQueryComponent = function(value) {
  return encodeURIComponent(value).replace(/%20/g, '+').replace(/%2C/g, ',');
};

const generateQuery = function(specs, resource, originalUrl, path) {
  var addQuery, query, queryParts;
  query = '';
  queryParts = [];
  addQuery = function(key, value) {
    if (value === null || value === void 0) {
      return;
    }
    queryParts.push([key, encodeQueryComponent(value)].join('='));
  };
  addQuery('q', specs.searchQuery);
  addQuery('municipality', specs.municipality);
  addQuery('service', specs.services);
  addQuery('organization', specs.organization);
  if (resource === 'address') {
    addQuery('radius', specs.radius);
  }
  originalUrl = originalUrl.replace(/\/rdr\/?/, '');
  if (queryParts.length < 1 && path.length < 3) {
    // This represents the case where the redirect originates from
    // the root URL (no path, no query parameters).  In that case,
    // leave the _rdr parameter out.
    return '';
  }
  queryParts.push('_rdr=' + encodeURIComponent(originalUrl));
  return '?' + queryParts.join('&');
};

const getResource = function(specs) {
  if (specs.unit || (specs.services && !specs.searchQuery)) {
    return 'unit';
  } else if (specs.searchQuery) {
    return 'search';
  } else if (specs.address) {
    return 'address';
  }
  return null;
};

const generateUrl = function(specs, originalUrl) {
  var address, fragment, host, path, protocol, resource, subDomain;
  protocol = 'https://';
  subDomain = 'palvelukartta';
  resource = getResource(specs);
  host = [subDomain, 'hel', 'fi'].join('.');
  path = [host, specs.language.id];
  fragment = '';
  if (specs.isEmbed === true) {
    // TODO: kml versions ?
    path.push('embed');
  }
  if (resource) {
    path.push(resource);
  }
  if (resource === 'address') {
    address = specs.address;
    path = path.concat([address.municipality, address.street, address.number]);
    if (specs.serviceCategory !== null) {
      fragment = '#!service-details';
    }
  } else if (resource === 'unit' && specs.unit !== null) {
    path.push(specs.unit);
  }
  return protocol + path.join('/') + generateQuery(specs, resource, originalUrl, path) + fragment;
};

const getMunicipalityFromGeocoder = function(address, language, callback) {
  var municipality, request, timeout, url;
  municipality = address.municipality;
  if ((municipality != null) && municipality.length) {
    callback(municipality);
    return;
  }
  timeout = setTimeout((function() {
    return callback(null);
  }), 3000);
  url = `${config.serviceMapAPI}/address/?language=${language}&number=${address.number}&street=${address.street}&page_size=1`;
  request = https.get(url, function(apiResponse) {
    var respData;
    if (apiResponse.statusCode !== 200) {
      clearTimeout(timeout);
      callback(null);
      return;
    }
    respData = '';
    apiResponse.on('data', function(data) {
      return respData += data;
    });
    return apiResponse.on('end', function() {
      var addressInfo, ref, ref1, ref2;
      addressInfo = JSON.parse(respData);
      clearTimeout(timeout);
      municipality = addressInfo != null ? (ref = addressInfo.results) != null ? (ref1 = ref[0]) != null ? (ref2 = ref1.street) != null ? ref2.municipality : void 0 : void 0 : void 0 : void 0;
      callback(municipality);
    });
  });
  return request.on('error', (error) => {
    console.error('Error geocoding using servicemap API', error);
    callback(null);
  });
};

const legacyRedirector = function(req, res) {
  var resource, specs, url;
  specs = extractSpecification(req);
  if (specs.override === true) {
    url = req.originalUrl.replace(/\/rdr\/?/, 'http://www.hel.fi/karttaupotus/');
    res.redirect(301, url);
    return;
  }
  resource = getResource(specs);
  if (resource === 'address' && (specs.address.municipality == null)) {
    getMunicipalityFromGeocoder(specs.address, specs.language.id, function(municipality) {
      if (municipality != null) {
        specs.address.municipality = municipality;
      } else {
        specs.address.municipality = 'helsinki';
      }
      url = generateUrl(specs, req.originalUrl);
      return res.redirect(301, url);
    });
  } else {
    url = generateUrl(specs, req.originalUrl);
    res.redirect(301, url);
  }
};

export default legacyRedirector;