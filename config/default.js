export default {
  // API
  "accessibilitySentenceAPI": {
    "root": process.env.ACCESSIBILITY_SENTENCE_API || 'https://www.hel.fi/palvelukarttaws/rest/v4'
  },
  "serviceMapAPI": {
    "root": process.env.SERVICEMAP_API || 'https://api.hel.fi/servicemap/v2'
  },
  "eventsAPI": {
    "root": process.env.EVENTS_API || 'https://api.hel.fi/linkedevents/v1',
  },
  "reservationsAPI": {
    "root": process.env.RESERVATIONS_API || 'https://api.hel.fi/respa/v1',
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
