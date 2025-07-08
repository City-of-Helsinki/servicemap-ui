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
    fi: {
      fi: 'suomi',
      en: 'englanti',
      sv: 'ruotsi',
    },
    en: {
      fi: 'finnish',
      en: 'english',
      sv: 'swedish',
    },
    sv: {
      fi: 'finska',
      en: 'engelska',
      sv: 'svenska',
    },
  },
  BACKGROUND_MAPS: SettingsUtility.mapSettings,
  CITIES: SettingsUtility.citySettings,
  ORGANIZATIONS: config.organizations.filter((org) =>
    SettingsUtility.organizationSettings.includes(org.id)
  ),
  DEFAULT_IFRAME_PROPERTIES: {
    style: {
      width: '100%',
      height: '100%',
    },
    frameBorder: 0,
  },
  DEFAULT_CUSTOM_WIDTH: '500',
  BASE_URL: '/embedder',
};

export default embedderConfig;
