export default {
  // server
  "server": {
    "address": "127.0.0.1",
    "port": "2048",
    "urlPrefix": "/"
  },
  // API
  "unit": {
    "apiUrl": "https://api.hel.fi/servicemap/v2/"
  },
  "events": {
    "apiUrl": "https://api.hel.fi/linkedevents/v1/"
  },
  "reservations": {
    "apiUrl": "https://api.hel.fi/respa/v1/"
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
