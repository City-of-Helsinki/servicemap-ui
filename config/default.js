export function getSettings() {
  if (typeof window !== 'undefined' && typeof window.nodeEnvSettings !== 'undefined') {
      // Needed in browser run context
      return window.nodeEnvSettings;
  }
  // This enables reading the environment variables from a .env file,
  // useful in a local development context.
  require('dotenv').config();
  // process.env is eeded in server run context and with jest tests
  return process.env;
}

function getVersion() {
  let version = {};
  if (typeof window !== 'undefined' && typeof window.nodeEnvSettings !== 'undefined') {
    version = window.nodeEnvSettings.appVersion;
  }
  console.log('Palvelukartta version:', `${version.tag} / ${version.commit}`);
  return version;
}

const settings = getSettings();
const version = getVersion();


if (typeof settings.PRODUCTION_PREFIX === 'undefined') {
    // This is the correct way to set fail-safe defaults for
    // configuration variables.
    //
    // This is because the defaults have to be set when in server
    // context and they need to be assigned to process.env so that
    // they get transferred to the client from the appropriate
    // process.env values by the node server when rendering HTML.
    settings.PRODUCTION_PREFIX = 'sm';
}

if (typeof settings.INITIAL_MAP_POSITION === 'undefined') {
    // If not set default to Helsinki
    settings.INITIAL_MAP_POSITION = '60.170377597530016,24.941309323934886';
}

if (typeof settings.MAPS === 'undefined') {
    // If not set default to Helsinki
    settings.MAPS = 'servicemap,ortographic,guidemap,accessible_map';
}

if (typeof settings.OLD_MAP_LINK_EN === 'undefined'
    && typeof settings.OLD_MAP_LINK_FI === 'undefined'
    && typeof settings.OLD_MAP_LINK_SV === 'undefined') {
    // If not set default to Helsinki
    settings.OLD_MAP_LINK_EN = 'https://palvelukartta-vanha.hel.fi/?lang=en';
    settings.OLD_MAP_LINK_FI = 'https://palvelukartta-vanha.hel.fi/?lang=fi';
    settings.OLD_MAP_LINK_SV = 'https://palvelukartta-vanha.hel.fi/?lang=sv';
}

if (typeof settings.CITIES === 'undefined') {
  // If not set default to Helsinki
  settings.CITIES = 'helsinki,espoo,vantaa,kauniainen,kirkkonummi';
}

if (typeof settings.ORGANIZATIONS === 'undefined') {
  // If not set default to Helsinki
  settings.ORGANIZATIONS = '[{ "id": "83e74666-0836-4c1d-948a-4b34a8b90301", "name": { "fi": "Helsingin kaupunki", "sv": "Helsingfors stad", "en": "City of Helsinki" } },{ "id": "520a4492-cb78-498b-9c82-86504de88dce", "name": { "fi": "Espoon kaupunki", "sv": "Esbo stad", "en": "City of Espoo" } },{ "id": "6d78f89c-9fd7-41d9-84e0-4b78c0fa25ce", "name": { "fi": "Vantaan kaupunki", "sv": "Vanda stad", "en": "City of Vantaa" } },{ "id": "6f0458d4-42a3-434a-b9be-20c19fcfa5c3", "name": { "fi": "Kauniaisten kaupunki", "sv": "Grankulla stad", "en": "Town of Kauniainen" } },{ "id": "015fd5cd-b280-4d24-a5b4-0ba6ecb4c8a4", "name": { "fi": "Kirkkonummi", "sv": "Kyrkslätt", "en": "Kirkkonummi" } },{ "id": "0c8e4f99-3d52-47b9-84df-395716bd8b11", "name": { "fi": "Länsi-Uudenmaan hyvinvointialue", "sv": "Västra Nylands välfärdsområde", "en": "Western Uusimaa Wellbeing Services County" } },{ "id": "5de91045-92ab-484b-9f96-7010ff7fb35e", "name": { "fi": "Vantaan ja Keravan hyvinvointialue", "sv": "Vanda och Kervo välfärdsområde", "en": "Wellbeing services county of Vantaa and Kerava" } }]';
}

if (typeof settings.SERVICE_MAP_URL === 'undefined') {
  // If not set default to Helsinki
  settings.SERVICE_MAP_URL = 'https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}';
}
if (typeof settings.ACCESSIBLE_MAP_URL === 'undefined') {
  // If not set default to Helsinki
  settings.ACCESSIBLE_MAP_URL = 'https://tiles.hel.ninja/styles/turku-osm-high-contrast-pattern/{z}/{x}/{y}';
}
if (typeof settings.ORTOGRAPHIC_MAP_URL === 'undefined') {
  // If not set default to Helsinki
  settings.ORTOGRAPHIC_MAP_URL = 'https://kartta.hsy.fi/geoserver/gwc/service/wmts?layer=taustakartat_ja_aluejaot:Ortoilmakuva_2019&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image%2Fpng';
}
if (typeof settings.GUIDE_MAP_URL === 'undefined') {
  // If not set default to Helsinki
  settings.GUIDE_MAP_URL = 'https://kartta.hel.fi/ws/geoserver/avoindata/gwc/service/wmts?layer=avoindata:Karttasarja_PKS&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image%2Fpng';
}

if (typeof settings.REITTIOPAS_URL === 'undefined') {
  settings.REITTIOPAS_URL = 'https://opas.matka.fi/reitti/';
}

if (typeof settings.HSL_ROUTE_GUIDE_URL === 'undefined') {
  settings.HSL_ROUTE_GUIDE_URL = 'https://reittiopas.hsl.fi/reitti/';
}

if (typeof settings.HSL_ROUTE_GUIDE_CITIES === 'undefined') {
  settings.HSL_ROUTE_GUIDE_CITIES = 'helsinki,espoo,vantaa,kauniainen,kerava';
}

if (typeof settings.SHOW_AREA_SELECTION === 'undefined') {
  // If not set default to Helsinki
  settings.SHOW_AREA_SELECTION = true;
}

if (typeof settings.READ_SPEAKER_URL === 'undefined') {
  // If not set default to false
  settings.READ_SPEAKER_URL = false;
}

if (typeof settings.FEEDBACK_ADDITIONAL_INFO_LINK_FI === 'undefined') {
  settings.FEEDBACK_ADDITIONAL_INFO_LINK_FI = 'https://palautteet.hel.fi/fi/tietoa-palautepalvelusta';
}
if (typeof settings.FEEDBACK_ADDITIONAL_INFO_LINK_SV === 'undefined') {
  settings.FEEDBACK_ADDITIONAL_INFO_LINK_SV = 'https://palautteet.hel.fi/sv/tietoa-palautepalvelusta';
}
if (typeof settings.FEEDBACK_ADDITIONAL_INFO_LINK_EN === 'undefined') {
  settings.FEEDBACK_ADDITIONAL_INFO_LINK_EN = 'https://palautteet.hel.fi/en/tietoa-palautepalvelusta';
}
if (typeof settings.ADDITIONAL_FEEDBACK_URLS_VANTAA === 'undefined') {
  settings.ADDITIONAL_FEEDBACK_URLS_VANTAA = 'https://www.vantaa.fi/fi/palaute,https://www.vantaa.fi/sv/feedback,https://www.vantaa.fi/en/feedback';
}
if (typeof settings.ADDITIONAL_FEEDBACK_URLS_ESPOO === 'undefined') {
  settings.ADDITIONAL_FEEDBACK_URLS_ESPOO = 'https://easiointi.espoo.fi/eFeedback/fi,https://easiointi.espoo.fi/eFeedback/sv,https://easiointi.espoo.fi/eFeedback/en';
}
if (typeof settings.ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI === 'undefined') {
  settings.ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI = 'https://kirkkonummi.fi/anna-palautetta-ja-vaikuta/,https://kyrkslatt.fi/ge-respons-och-paverka/,https://kirkkonummi.fi/anna-palautetta-ja-vaikuta/';
}
if (typeof settings.ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN === 'undefined') {
  settings.ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN = 'https://www.kauniainen.fi/kaupunki-ja-paatoksenteko/osallistu-ja-vaikuta/,https://www.kauniainen.fi/sv/staden-och-beslutsfattande/delta-och-paverka/,https://www.kauniainen.fi/kaupunki-ja-paatoksenteko/osallistu-ja-vaikuta/';
}
if (typeof settings.READ_FEEDBACK_URLS_HELSINKI === 'undefined') {
  settings.READ_FEEDBACK_URLS_HELSINKI = 'https://palautteet.hel.fi/fi/hae-palautteita#/app/search?r=12&text=,https://palautteet.hel.fi/sv/hae-palautteita#/app/search?r=12&text=,https://palautteet.hel.fi/en/hae-palautteita#/app/search?r=12&text='
}
if (typeof settings.FEEDBACK_IS_PUBLISHED === 'undefined') {
  // If not set default to Helsinki
  settings.FEEDBACK_IS_PUBLISHED = true;
}

if (typeof settings.USE_PTV_ACCESSIBILITY_API === 'undefined') {
  settings.USE_PTV_ACCESSIBILITY_API = false;
}

if (typeof settings.SENTRY_DSN_CLIENT === 'undefined') {
  settings.SENTRY_DSN_CLIENT = false;
}

if (settings.MATOMO_MOBILITY_DIMENSION_ID === 'undefined') {
  settings.MATOMO_MOBILITY_DIMENSION_ID = undefined;
}

if (settings.MATOMO_SENSES_DIMENSION_ID === 'undefined') {
  settings.MATOMO_SENSES_DIMENSION_ID = undefined;
}

if (settings.MATOMO_NO_RESULTS_DIMENSION_ID === 'undefined') {
  settings.MATOMO_NO_RESULTS_DIMENSION_ID = undefined;
}

if (settings.MATOMO_URL === 'undefined') {
  settings.MATOMO_URL = undefined;
}

if (settings.MATOMO_SITE_ID === 'undefined') {
  settings.MATOMO_SITE_ID = undefined;
}

if (typeof settings.EMBEDDER_DOCUMENTATION_URL === 'undefined') {
  settings.EMBEDDER_DOCUMENTATION_URL = 'https://kaupunkialustana.hel.fi/palvelukartta/palvelukartan-upotusohjeet/';
}

if (typeof settings.SLOW_FETCH_MESSAGE_TIMEOUT === 'undefined') {
  settings.SLOW_FETCH_MESSAGE_TIMEOUT = 3000;
}

let municipalities;
try {
  municipalities = require('./municipalities.json');
} catch(e) {
  municipalities = {
    fi: {
      espoo: 'Espoo',
      helsinki: 'Helsinki',
      kauniainen: 'Kauniainen',
      vantaa: 'Vantaa',
      kirkkonummi: 'Kirkkonummi'
    },
    en: {
      espoo: 'Espoo',
      helsinki: 'Helsinki',
      kauniainen: 'Kauniainen',
      vantaa: 'Vantaa',
      kirkkonummi: 'Kirkkonummi'
    },
    sv: {
      espoo: 'Esbo',
      helsinki: 'Helsingfors',
      kauniainen: 'Grankulla',
      vantaa: 'Vanda',
      kirkkonummi: 'Kyrkslätt'
    }
  }
}
/**
 * Assumes comma separated and ordered triple of fi, sv, en
 */
const splitTripleIntoThreeLangs = (text) => ({ fi: text.split(',')[0], sv: text.split(',')[1], en: text.split(',')[2] })

export default {
  "version": version.tag,
  "commit": version.commit,
  // API
  "accessibilitySentenceAPI": {
    "root": settings.ACCESSIBILITY_SENTENCE_API,
    "id": 'ACCESSIBILITY_SENTENCE_API',
  },
  "serviceMapAPI": {
    "root": settings.SERVICEMAP_API,
    "version": settings.SERVICEMAP_API_VERSION,
    "id": 'SERVICEMAP_API',
  },
  "eventsAPI": {
    "root": settings.EVENTS_API,
    "id": 'EVENTS_API',
  },
  "reservationsAPI": {
    "root": settings.RESERVATIONS_API,
    "id": 'RESERVATIONS_API',
  },
  "productionPrefix": settings.PRODUCTION_PREFIX,
  "digitransitAPI": {
    "root": settings.DIGITRANSIT_API,
    "id": 'DIGITRANSIT_API',
  },
  "digitransitApiKey": {
    "root": settings.DIGITRANSIT_API_KEY,
    "id": 'DIGITRANSIT_API_KEY',
  },
  "feedbackURL": {
    "root": settings.FEEDBACK_URL,
    "id": 'FEEDBACK_URL',
  },
  "hearingMapAPI": {
    "root": settings.HEARING_MAP_API,
    "id": 'HEARING_MAP_API',
  },
  // constants
  "accessibilityColors":  {
    "default": "#2242C7",
    "missingInfo": "#4A4A4A",
    "shortcomings": "#b00021",
  },
  "additionalFeedbackURLs": {
    espoo: splitTripleIntoThreeLangs(settings.ADDITIONAL_FEEDBACK_URLS_ESPOO),
    vantaa: splitTripleIntoThreeLangs(settings.ADDITIONAL_FEEDBACK_URLS_VANTAA),
    kauniainen: splitTripleIntoThreeLangs(settings.ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN),
    kirkkonummi: splitTripleIntoThreeLangs(settings.ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI),
  },
  "readFeedbackURLS": {
    helsinki: splitTripleIntoThreeLangs(settings.READ_FEEDBACK_URLS_HELSINKI),
  },
  "production": settings.MODE === 'production',
  "initialMapPosition": settings.INITIAL_MAP_POSITION.split(','),
  "servicemapURL": settings.SERVICE_MAP_URL,
  "accessibleMapURL": settings.ACCESSIBLE_MAP_URL,
  "ortographicMapURL": settings.ORTOGRAPHIC_MAP_URL,
  "ortographicWMSURL": settings.ORTOGRAPHIC_WMS_URL,
  "ortographicWMSLAYER": settings.ORTOGRAPHIC_WMS_LAYER,
  "guideMapURL": settings.GUIDE_MAP_URL,
  "reittiopasURL": settings.REITTIOPAS_URL,
  "hslRouteGuideURL": settings.HSL_ROUTE_GUIDE_URL,
  "outdoorExerciseURL": settings.OUTDOOR_EXERCISE_URL,
  "natureAreaURL": settings.NATURE_AREA_URL,
  "embedderDocumentationUrl": settings.EMBEDDER_DOCUMENTATION_URL,
  "cities": settings.CITIES.split(','),
  "organizations": JSON.parse(settings.ORGANIZATIONS),
  "hslRouteGuideCities": settings.HSL_ROUTE_GUIDE_CITIES.split(','),
  "maps": settings.MAPS.split(','),
  "smallContentAreaBreakpoint": 449,
  "mobileUiBreakpoint": 699,
  "municipality": municipalities,
  "smallScreenBreakpoint": 919,
  "smallWidthForTopBarBreakpoint": 1079,
  "topBarHeight": 90,
  "topBarHeightMobile": 78,
  "bottomNavHeight": 78,
  "searchTimeout": 15000,
  // locales
  "defaultLocale": 'fi',
  "streetAddressLanguages": ["fi", "sv"],
  "supportedLanguages": [
    "fi", "sv", "en"
  ],
  "SUBDOMAINS": {
    fi: 'palvelukartta',
    sv: 'servicekarta',
    en: 'servicemap',
  },
  "oldMapEn": settings.OLD_MAP_LINK_EN,
  "oldMapFi": settings.OLD_MAP_LINK_FI,
  "oldMapSv": settings.OLD_MAP_LINK_SV,
  "accessibilityStatementURL": {
    fi: settings.ACCESSIBILITY_STATEMENT_URL_FI,
    sv: settings.ACCESSIBILITY_STATEMENT_URL_SV,
    en: settings.ACCESSIBILITY_STATEMENT_URL_EN,
  },
  "readspeakerLocales": {
    "fi": 'fi_fi',
    "en": 'en_uk',
    "sv": 'sv_se',
  },
  "sentryDSN": (settings.SENTRY_DSN_CLIENT !== 'false') ? settings.SENTRY_DSN_CLIENT : false,
  "showAreaSelection": (settings.SHOW_AREA_SELECTION === 'true'),
  "showReadSpeakerButton": (settings.READ_SPEAKER_URL !== 'false' && settings.READ_SPEAKER_URL !== false),
  "feedbackAdditionalInfoLink": {
    fi: settings.FEEDBACK_ADDITIONAL_INFO_LINK_FI,
    sv: settings.FEEDBACK_ADDITIONAL_INFO_LINK_SV,
    en: settings.FEEDBACK_ADDITIONAL_INFO_LINK_EN,
  },
  "feedbackIsPublished": (settings.FEEDBACK_IS_PUBLISHED === 'true'),
  "usePtvAccessibilityApi": (settings.USE_PTV_ACCESSIBILITY_API) === 'true',
  "matomoMobilityDimensionID": settings.MATOMO_MOBILITY_DIMENSION_ID,
  "matomoSensesDimensionID": settings.MATOMO_SENSES_DIMENSION_ID,
  "matomoNoResultsDimensionID": settings.MATOMO_NO_RESULTS_DIMENSION_ID,
  "matomoUrl": settings.MATOMO_URL,
  "matomoSiteId": settings.MATOMO_SITE_ID,
  "slowFetchMessageTimeout": Number(settings.SLOW_FETCH_MESSAGE_TIMEOUT)
}
