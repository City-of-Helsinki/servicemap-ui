import { config as dotEnvConfig } from 'dotenv';

function getSettings() {
  if (typeof window !== 'undefined' && typeof window.nodeEnvSettings !== 'undefined') {
      // Needed in browser run context
      return window.nodeEnvSettings;
  }
  // This enables reading the environment variables from a .env file,
  // useful in a local development context.
  dotEnvConfig();
  // process.env is eeded in server run context and with jest tests
  return process.env;
}

const settings = getSettings();

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

export default {
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
  // constants
  "accessibilityColors":  {
    "default": "#2242C7",
    "missingInfo": "#4A4A4A",
    "shortcomings": "#b00021",
  },
  "initialMapPosition": [60.170377597530016, 24.941309323934886],
  "smallContentAreaBreakpoint": 449,
  "mobileUiBreakpoint": 699,
  "smallScreenBreakpoint": 899,
  "topBarHeight": 100,
  "topBarHeightMobile": 90,
  // locales
  "defaultLocale": 'fi',
  "streetAddressLanguages": ["fi", "sv"],
  "supportedLanguages": [
    "fi", "sv", "en"
  ],
}
