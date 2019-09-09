export default {
  // API
  "accessibilitySentenceAPI": {
    "root": process.env.ACCESSIBILITY_SENTENCE_API
  },
  "serviceMapAPI": {
    "root": process.env.SERVICEMAP_API
  },
  "eventsAPI": {
    "root": process.env.EVENTS_API
  },
  "reservationsAPI": {
    "root": process.env.RESERVATIONS_API
  },
  // constants
  "accessibilityColors":  {
    "default": "#2242C7",
    "missingInfo": "#4A4A4A",
    "shortcomings": "#b00021",
  },
  "mobileUiBreakpoint": 699,
  "smallScreenBreakpoint": 899,
  "topBarHeight": 64,
  // locales
  "defaultLocale": 'fi',
  "streetAddressLanguages": ["fi", "sv"],
  "supportedLanguages": [
    "fi", "sv", "en"
  ],
}
