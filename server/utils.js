import I18n from '../src/i18n';
import config from '../config';
import https from 'https';

const serverConfig = config.server;
const allowedUrls = [
  /^\/.{2,}\/$/,
  /^\/.{2,}\/unit\/\d+$/,
  /^\/.{2,}\/unit$/,
  /^\/.{2,}\/search$/,
  /^\/.{2,}\/address\/[^\/]+\/[^\/]+\/[^\/]+$/,
  /^\/.{2,}\/division\/[^\/]+\/[^\/]+$/,
  /^\/.{2,}\/division$/,
  /^\/.{2,}\/area$/,
];

// Handle language change
export const makeLanguageHandler = (req, res, next) => {
  // Check if request url is actual path
  let match = false;
  allowedUrls.forEach((url) => {
    if (!match && req.path.match(url)) {
      match = true;
    }
  });

  if(!match) {
    next();
    return;
  }

  // Handle language check and redirect if language is changed to default
  const i18n = new I18n();
  const pathArray = req.url.split('/');
  if (!i18n.isValidLocale(pathArray[1])) {
    pathArray[1] = i18n.locale;
    res.redirect(pathArray.join('/'));
    return;
  }

  next();
  return;
};

// Handle unit data fetching
export const makeUnitHandler = (req, res, next) => {
  const pattern = /^\/(\d+)\/?$/;
  const r = req.path.match(pattern);
  if(!r || r.length < 2) {
    res.redirect(serverConfig.url_prefix);
    return;
  }

  // Handle unit data collection from api
  const unitId = r[1];
  const url = `${config.unit.api_url}unit/${unitId}/?include=services`;
  let unitInfo = null;
  let context = null;
  
  const sendResponse = () => {
    if (unitInfo && unitInfo.name) {
      context = unitInfo;
    }

    req._context = context; // Add unit data to request 
    next();
  };
  
  const timeout = setTimeout(sendResponse, 2000); //
  console.log(`Fetching unit data from: ${url}`)
  const request = https.get(url, function(httpResp) {
    if (httpResp.statusCode !== 200) {
      console.log(`Fetch failed with code: ${httpResp.statusCode}`);
      clearTimeout(timeout);
      sendResponse();
      return;
    }
    let respData = '';
    httpResp.on('data', function(data) {
      return respData += data;
    });
    return httpResp.on('end', function() {
      console.log('Fetch end');
      unitInfo = JSON.parse(respData);
      unitInfo.complete = true;
      clearTimeout(timeout);
      return sendResponse();
    });
  });

  request.on('error', (error) => {
    return console.error('Error making API request', error);
  });
}