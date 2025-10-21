import dotenv from 'dotenv';

// Default values for environment variables
const defaults = {
  REACT_APP_PRODUCTION_PREFIX: 'sm',
  REACT_APP_INITIAL_MAP_POSITION: '60.170377597530016,24.941309323934886',
  REACT_APP_MAPS: 'servicemap,ortographic,accessible_map,guidemap,plainmap',
  REACT_APP_CITIES: 'helsinki,espoo,vantaa,kauniainen,kirkkonummi',
  // eslint-disable-next-line max-len
  REACT_APP_ORGANIZATIONS: '[{ "id": "83e74666-0836-4c1d-948a-4b34a8b90301", "name": { "fi": "Helsingin kaupunki", "sv": "Helsingfors stad", "en": "City of Helsinki" } },{ "id": "520a4492-cb78-498b-9c82-86504de88dce", "name": { "fi": "Espoon kaupunki", "sv": "Esbo stad", "en": "City of Espoo" } },{ "id": "6d78f89c-9fd7-41d9-84e0-4b78c0fa25ce", "name": { "fi": "Vantaan kaupunki", "sv": "Vanda stad", "en": "City of Vantaa" } },{ "id": "6f0458d4-42a3-434a-b9be-20c19fcfa5c3", "name": { "fi": "Kauniaisten kaupunki", "sv": "Grankulla stad", "en": "Town of Kauniainen" } },{ "id": "015fd5cd-b280-4d24-a5b4-0ba6ecb4c8a4", "name": { "fi": "Kirkkonummi", "sv": "Kyrkslätt", "en": "Kirkkonummi" } },{ "id": "0c8e4f99-3d52-47b9-84df-395716bd8b11", "name": { "fi": "Länsi-Uudenmaan hyvinvointialue", "sv": "Västra Nylands välfärdsområde", "en": "Western Uusimaa Wellbeing Services County" } },{ "id": "5de91045-92ab-484b-9f96-7010ff7fb35e", "name": { "fi": "Vantaan ja Keravan hyvinvointialue", "sv": "Vanda och Kervo välfärdsområde", "en": "Wellbeing services county of Vantaa and Kerava" } }]',
  REACT_APP_SERVICE_MAP_URL: 'https://tiles.hel.ninja/styles/hel-osm-bright/{z}/{x}/{y}',
  REACT_APP_ACCESSIBLE_MAP_URL: 'https://tiles.hel.ninja/styles/turku-osm-high-contrast-pattern/{z}/{x}/{y}',
  // eslint-disable-next-line max-len
  REACT_APP_ORTOGRAPHIC_MAP_URL: 'https://kartta.hsy.fi/geoserver/gwc/service/wmts?layer=taustakartat_ja_aluejaot:Ortoilmakuva_2019&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image%2Fpng',
  // eslint-disable-next-line max-len
  REACT_APP_GUIDE_MAP_URL: 'https://kartta.hel.fi/ws/geoserver/avoindata/gwc/service/wmts?layer=avoindata:Karttasarja_PKS&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image%2Fpng',
  // eslint-disable-next-line max-len
  REACT_APP_PLAIN_MAP_URL: 'https://mml-tiles.hel.ninja/avoin/wmts/1.0.0/selkokartta/default/ETRS-TM35FIN/{z}/{y}/{x}.png',
  REACT_APP_REITTIOPAS_URL: 'https://opas.matka.fi/reitti/',
  REACT_APP_HSL_ROUTE_GUIDE_URL: 'https://reittiopas.hsl.fi/reitti/',
  REACT_APP_HSL_ROUTE_GUIDE_CITIES: 'helsinki,espoo,vantaa,kauniainen,kerava',
  REACT_APP_SHOW_AREA_SELECTION: 'true',
  REACT_APP_READ_SPEAKER_URL: 'false',
  REACT_APP_FEEDBACK_ADDITIONAL_INFO_LINK_FI: 'https://palautteet.hel.fi/fi/tietoa-palautepalvelusta',
  REACT_APP_FEEDBACK_ADDITIONAL_INFO_LINK_SV: 'https://palautteet.hel.fi/sv/tietoa-palautepalvelusta',
  REACT_APP_FEEDBACK_ADDITIONAL_INFO_LINK_EN: 'https://palautteet.hel.fi/en/tietoa-palautepalvelusta',
  // eslint-disable-next-line max-len
  REACT_APP_ADDITIONAL_FEEDBACK_URLS_VANTAA: 'https://www.vantaa.fi/fi/palaute,https://www.vantaa.fi/sv/feedback,https://www.vantaa.fi/en/feedback',
  // eslint-disable-next-line max-len
  REACT_APP_ADDITIONAL_FEEDBACK_URLS_ESPOO: 'https://easiointi.espoo.fi/eFeedback/fi,https://easiointi.espoo.fi/eFeedback/sv,https://easiointi.espoo.fi/eFeedback/en',
  // eslint-disable-next-line max-len
  REACT_APP_ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI: 'https://kirkkonummi.fi/anna-palautetta-ja-vaikuta/,https://kyrkslatt.fi/ge-respons-och-paverka/,https://kirkkonummi.fi/anna-palautetta-ja-vaikuta/',
  // eslint-disable-next-line max-len
  REACT_APP_ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN: 'https://www.kauniainen.fi/kaupunki-ja-paatoksenteko/osallistu-ja-vaikuta/,https://www.kauniainen.fi/sv/staden-och-beslutsfattande/delta-och-paverka/,https://www.kauniainen.fi/kaupunki-ja-paatoksenteko/osallistu-ja-vaikuta/',
  // eslint-disable-next-line max-len
  REACT_APP_READ_FEEDBACK_URLS_HELSINKI: 'https://palautteet.hel.fi/fi/hae-palautteita#/app/search?r=12&text=,https://palautteet.hel.fi/sv/hae-palautteita#/app/search?r=12&text=,https://palautteet.hel.fi/en/hae-palautteita#/app/search?r=12&text=',
  REACT_APP_FEEDBACK_IS_PUBLISHED: 'true',
  REACT_APP_USE_PTV_ACCESSIBILITY_API: 'false',
  REACT_APP_SENTRY_DSN_CLIENT: 'false',
  REACT_APP_SLOW_FETCH_MESSAGE_TIMEOUT: '3000',
  REACT_APP_FEATURE_SERVICEMAP_PAGE_TRACKING: 'false',
  REACT_APP_FEATURE_SM_COOKIES: 'true',
  // eslint-disable-next-line max-len
  REACT_APP_EMBEDDER_DOCUMENTATION_URL: 'https://kaupunkialustana.hel.fi/palvelukartta/palvelukartan-upotusohjeet/',
  // Missing URL variables from old config
  REACT_APP_OUTDOOR_EXERCISE_URL: 'https://ulkoliikunta.fi',
  REACT_APP_NATURE_AREA_URL: 'https://kartta.hel.fi/ltj/feature-report/',
  REACT_APP_VANTAA_NATURE_AREA_URL: 'https://www.vantaa.fi/fi/palveluhakemisto/palvelu/luonnonsuojelualueet',
  REACT_APP_ORTOGRAPHIC_WMS_URL: 'https://kartta.hsy.fi/geoserver/wms',
  REACT_APP_ORTOGRAPHIC_WMS_LAYER: 'taustakartat_ja_aluejaot:Ortoilmakuva_2019',
  REACT_APP_ACCESSIBILITY_STATEMENT_URL_FI: 'https://kaupunkialustana.hel.fi/palvelukartan-saavutettavuusseloste/',
  REACT_APP_ACCESSIBILITY_STATEMENT_URL_SV: 'https://kaupunkialustana.hel.fi/sv/servicekartans-tillganglighetsutlatande/',
  REACT_APP_ACCESSIBILITY_STATEMENT_URL_EN: 'https://kaupunkialustana.hel.fi/en/accessibility-statement-of-the-service-map/',
  // API endpoints
  REACT_APP_SERVICEMAP_API: 'https://api.hel.fi/servicemap/',
  REACT_APP_SERVICEMAP_API_VERSION: 'v2',
  REACT_APP_EVENTS_API: 'https://api.hel.fi/linkedevents/v1',
  REACT_APP_RESERVATIONS_API: 'https://varaamo.hel.fi',
  REACT_APP_FEEDBACK_URL: 'https://api.hel.fi/servicemap/open311/',
  REACT_APP_DIGITRANSIT_API: 'https://digitransit-proxy.api.hel.fi/routing/v2/hsl/gtfs/v1',
  REACT_APP_HEARING_MAP_API: 'https://kuulokuvat.fi/api/v1/servicemap-url',
  REACT_APP_ACCESSIBILITY_SENTENCE_API: 'https://www.hel.fi/palvelukarttaws/rest/v4',
  // Matomo analytics variables
  REACT_APP_MATOMO_URL: '',
  REACT_APP_MATOMO_SITE_ID: '',
  REACT_APP_MATOMO_MOBILITY_DIMENSION_ID: '',
  REACT_APP_MATOMO_SENSES_DIMENSION_ID: '',
  REACT_APP_MATOMO_NO_RESULTS_DIMENSION_ID: '',
  REACT_APP_MATOMO_ENABLED: '',
};

function applyDefaults(envObj) {
  const result = { ...defaults };

  // Override defaults with actual env values
  Object.keys(envObj).forEach(key => {
    if (envObj[key] !== undefined && envObj[key] !== null && envObj[key] !== '' && envObj[key] !== 'undefined') {
      result[key] = envObj[key];
    }
  });

  return result;
}

export function getSettings() {
  // Check for server-injected environment variables first (for runtime env overrides)
  if (typeof window !== 'undefined' && typeof window.nodeEnvSettings !== 'undefined') {
    return applyDefaults(window.nodeEnvSettings);
  }
  
  // Use Vite's import.meta.env for client-side (build-time variables)
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
    return applyDefaults(import.meta.env);
  }

  // Use process.env for server-side
  dotenv.config();
  return applyDefaults(process.env);
}

function getVersion() {
  // Use Vite's define config for git version info
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
    return {
      tag: import.meta.env.REACT_APP_GIT_TAG,
      commit: import.meta.env.REACT_APP_GIT_COMMIT,
    };
  }
  // Use process.env for server-side
  return {
    tag: process.env.REACT_APP_GIT_TAG,
    commit: process.env.REACT_APP_GIT_COMMIT,
  };
}

const settings = getSettings();
const version = getVersion();

const municipalities = {
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

/**
 * Assumes comma separated and ordered triple of fi, sv, en
 */
const splitTripleIntoThreeLangs = (text) => ({ fi: text.split(',')[0], sv: text.split(',')[1], en: text.split(',')[2] })

const defaultConfig = {
  "version": version.tag,
  "commit": version.commit,
  // API
  "accessibilitySentenceAPI": {
    "root": settings.REACT_APP_ACCESSIBILITY_SENTENCE_API,
    "id": 'ACCESSIBILITY_SENTENCE_API',
  },
  "serviceMapAPI": {
    "root": settings.REACT_APP_SERVICEMAP_API,
    "version": settings.REACT_APP_SERVICEMAP_API_VERSION,
    "id": 'SERVICEMAP_API',
  },
  "eventsAPI": {
    "root": settings.REACT_APP_EVENTS_API,
    "id": 'EVENTS_API',
  },
  "reservationsAPI": {
    "root": settings.REACT_APP_RESERVATIONS_API,
    "id": 'RESERVATIONS_API',
  },
  "productionPrefix": settings.REACT_APP_PRODUCTION_PREFIX,
  "digitransitAPI": {
    "root": settings.REACT_APP_DIGITRANSIT_API,
    "id": 'DIGITRANSIT_API',
  },
  "feedbackURL": {
    "root": settings.REACT_APP_FEEDBACK_URL,
    "id": 'FEEDBACK_URL',
  },
  "hearingMapAPI": {
    "root": settings.REACT_APP_HEARING_MAP_API,
    "id": 'HEARING_MAP_API',
  },
  // constants
  "accessibilityColors": {
    "default": "#2242C7",
    "missingInfo": "#4A4A4A",
    "shortcomings": "#b00021",
  },
  "additionalFeedbackURLs": {
    espoo: splitTripleIntoThreeLangs(settings.REACT_APP_ADDITIONAL_FEEDBACK_URLS_ESPOO),
    vantaa: splitTripleIntoThreeLangs(settings.REACT_APP_ADDITIONAL_FEEDBACK_URLS_VANTAA),
    kauniainen: splitTripleIntoThreeLangs(settings.REACT_APP_ADDITIONAL_FEEDBACK_URLS_KAUNIAINEN),
    kirkkonummi: splitTripleIntoThreeLangs(settings.REACT_APP_ADDITIONAL_FEEDBACK_URLS_KIRKKONUMMI),
  },
  "readFeedbackURLS": {
    helsinki: splitTripleIntoThreeLangs(settings.REACT_APP_READ_FEEDBACK_URLS_HELSINKI),
  },
  "production": settings.MODE === 'production',
  "initialMapPosition": settings.REACT_APP_INITIAL_MAP_POSITION.split(','),
  "servicemapURL": settings.REACT_APP_SERVICE_MAP_URL,
  "accessibleMapURL": settings.REACT_APP_ACCESSIBLE_MAP_URL,
  "ortographicMapURL": settings.REACT_APP_ORTOGRAPHIC_MAP_URL,
  "ortographicWMSURL": settings.REACT_APP_ORTOGRAPHIC_WMS_URL,
  "ortographicWMSLAYER": settings.REACT_APP_ORTOGRAPHIC_WMS_LAYER,
  "guideMapURL": settings.REACT_APP_GUIDE_MAP_URL,
  "plainMapURL": settings.REACT_APP_PLAIN_MAP_URL,
  "reittiopasURL": settings.REACT_APP_REITTIOPAS_URL,
  "hslRouteGuideURL": settings.REACT_APP_HSL_ROUTE_GUIDE_URL,
  "outdoorExerciseURL": settings.REACT_APP_OUTDOOR_EXERCISE_URL,
  "natureAreaURL": settings.REACT_APP_NATURE_AREA_URL,
  "vantaaNatureAreaURL": settings.REACT_APP_VANTAA_NATURE_AREA_URL,
  "embedderDocumentationUrl": settings.REACT_APP_EMBEDDER_DOCUMENTATION_URL,
  "cities": settings.REACT_APP_CITIES.split(','),
  "organizations": JSON.parse(settings.REACT_APP_ORGANIZATIONS),
  "hslRouteGuideCities": settings.REACT_APP_HSL_ROUTE_GUIDE_CITIES.split(','),
  "maps": settings.REACT_APP_MAPS.split(','),
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
  "accessibilityStatementURL": {
    fi: settings.REACT_APP_ACCESSIBILITY_STATEMENT_URL_FI,
    sv: settings.REACT_APP_ACCESSIBILITY_STATEMENT_URL_SV,
    en: settings.REACT_APP_ACCESSIBILITY_STATEMENT_URL_EN,
  },
  "readspeakerLocales": {
    "fi": 'fi_fi',
    "en": 'en_uk',
    "sv": 'sv_se',
  },
  "sentryDSN": (settings.REACT_APP_SENTRY_DSN_CLIENT !== 'false') ? settings.REACT_APP_SENTRY_DSN_CLIENT : false,
  "showAreaSelection": (settings.REACT_APP_SHOW_AREA_SELECTION === 'true'),
  // eslint-disable-next-line max-len
  "showReadSpeakerButton": (settings.REACT_APP_READ_SPEAKER_URL !== 'false' && settings.REACT_APP_READ_SPEAKER_URL !== false),
  "feedbackAdditionalInfoLink": {
    fi: settings.REACT_APP_FEEDBACK_ADDITIONAL_INFO_LINK_FI,
    sv: settings.REACT_APP_FEEDBACK_ADDITIONAL_INFO_LINK_SV,
    en: settings.REACT_APP_FEEDBACK_ADDITIONAL_INFO_LINK_EN,
  },
  "feedbackIsPublished": (settings.REACT_APP_FEEDBACK_IS_PUBLISHED === 'true'),
  "usePtvAccessibilityApi": (settings.REACT_APP_USE_PTV_ACCESSIBILITY_API) === 'true',
  "matomoMobilityDimensionID": settings.REACT_APP_MATOMO_MOBILITY_DIMENSION_ID,
  "matomoSensesDimensionID": settings.REACT_APP_MATOMO_SENSES_DIMENSION_ID,
  "matomoNoResultsDimensionID": settings.REACT_APP_MATOMO_NO_RESULTS_DIMENSION_ID,
  "matomoUrl": settings.REACT_APP_MATOMO_URL,
  "matomoSiteId": settings.REACT_APP_MATOMO_SITE_ID,
  "matomoEnabled": settings.REACT_APP_MATOMO_ENABLED,
  "slowFetchMessageTimeout": Number(settings.REACT_APP_SLOW_FETCH_MESSAGE_TIMEOUT),
}

export default defaultConfig;
