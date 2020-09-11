function getSettings() {
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
  if (typeof window !== 'undefined' && typeof window.nodeEnvSettings !== 'undefined') {
      return window.appVersion;
  }
  return {};
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
    settings.MAPS = 'servicemap,ortographic,guideMap,accessible_map';
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
  settings.CITIES = 'helsinki,espoo,vantaa,kauniainen';
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
  settings.ORTOGRAPHIC_MAP_URL = 'https://kartta.hsy.fi/geoserver/gwc/service/wmts?layer=taustakartat_ja_aluejaot:Ortoilmakuva_2017&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image/jpeg';
}
if (typeof settings.GUIDE_MAP_URL === 'undefined') {
  // If not set default to Helsinki
  settings.GUIDE_MAP_URL = 'https://kartta.hel.fi/ws/geoserver/avoindata/gwc/service/wmts?layer=avoindata:Karttasarja_PKS&tilematrixset=ETRS-GK25&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=ETRS-GK25:{z}&TileCol={x}&TileRow={y}&Format=image%2Fpng';
}

export default {
  "version": version.tag,
  "commit": version.commit,
  // API
  "accessibilitySentenceAPI": {
    "root": settings.ACCESSIBILITY_SENTENCE_API,
  },
  "serviceMapAPI": {
    "root": settings.SERVICEMAP_API,
  },
  "eventsAPI": {
    "root": settings.EVENTS_API,
  },
  "reservationsAPI": {
    "root": settings.RESERVATIONS_API,
  },
  "productionPrefix": settings.PRODUCTION_PREFIX,
  "digitransitAPI": {
    "root": settings.DIGITRANSIT_API,
  },
  "feedbackURL": {
    "root": settings.FEEDBACK_URL,
  },
  "hearingMapAPI": {
    "root": settings.HEARING_MAP_API,
  },
  // constants
  "accessibilityColors":  {
    "default": "#2242C7",
    "missingInfo": "#4A4A4A",
    "shortcomings": "#b00021",
  },
  "production": settings.MODE === 'production',
  "initialMapPosition": settings.INITIAL_MAP_POSITION.split(','),
  "servicemap_url": settings.SERVICE_MAP_URL,
  "accessible_map_url": settings.ACCESSIBLE_MAP_URL,
  "ortographic_map_url": settings.ORTOGRAPHIC_MAP_URL,
  "guide_map_url": settings.GUIDE_MAP_URL,
  "cities": settings.CITIES.split(','),
  "maps": settings.MAPS.split(','),
  "smallContentAreaBreakpoint": 449,
  "mobileUiBreakpoint": 699,
  "municipality": {
    fi: {
      espoo: 'Espoo',
      helsinki: 'Helsinki',
      kauniainen: 'Kauniainen',
      vantaa: 'Vantaa'
    },
    en: {
      espoo: 'Espoo',
      helsinki: 'Helsinki',
      kauniainen: 'Kauniainen',
      vantaa: 'Vantaa'
    },
    sv: {
      espoo: 'Esbo',
      helsinki: 'Helsingfors',
      kauniainen: 'Grankulla',
      vantaa: 'Vanda'
    }
  },
  "smallScreenBreakpoint": 899,
  "topBarHeight": 100,
  "topBarHeightMobile": 90,
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
  "old_map_en": settings.OLD_MAP_LINK_EN,
  "old_map_fi": settings.OLD_MAP_LINK_FI,
  "old_map_sv": settings.OLD_MAP_LINK_SV,
  "readspeakerLocales": {
    "fi": 'fi_fi',
    "en": 'en_uk',
    "sv": 'sv_se',
  }
}
