export default {
  // API
  "accessibilitySentenceAPI": {
    "root": process.env.ACCESSIBILITY_SENTENCE_API,
  },
  "serviceMapAPI": {
    "root": process.env.SERVICEMAP_API,
  },
  "eventsAPI": {
    "root": process.env.EVENTS_API,
  },
  "reservationsAPI": {
    "root": process.env.RESERVATIONS_API,
  },
  // constants
  "accessibilityColors":  {
    "default": "#2242C7",
    "missingInfo": "#4A4A4A",
    "shortcomings": "#b00021",
  },
  "initialMapPosition": [60.170377597530016, 24.941309323934886],
  "smallContentAreaBreakpoint": 449,
  "mobileUiBreakpoint": 699,
  "productionPrefix": process.env.PRODUCTION_PREFIX,
  "smallScreenBreakpoint": 899,
  "topBarHeight": 98,
  "topBarHeightMobile": 88,
  // locales
  "defaultLocale": 'fi',
  "streetAddressLanguages": ["fi", "sv"],
  "supportedLanguages": [
    "fi", "sv", "en"
  ],
}
