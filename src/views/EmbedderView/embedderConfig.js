import config from '../../../config';
import SettingsUtility from '../../utils/settings';

const { SUBDOMAINS } = config;

const embedderConfig = {
  DOMAIN: null,
  SUBDOMAINS,
  LANGUAGE: {
    palvelukartta: 'fi',
    servicekarta: 'sv',
    servicemap: 'en',
  },
  LANGUAGES: {
    fi: 'suomi',
    en: 'english',
    sv: 'svenska',
  },
  BACKGROUND_MAPS: SettingsUtility.mapSettings,
  CITIES: SettingsUtility.citySettings,
  DEFAULT_IFRAME_PROPERTIES: {
    style: {
      width: '100%',
      height: '100%',
    },
    frameBorder: 0,
  },
  DEFAULT_CUSTOM_WIDTH: '400',
  BASE_URL: '/embedder',
};

export default embedderConfig;
