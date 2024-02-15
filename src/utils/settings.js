import LocalStorageUtility from './localStorage';
import config from '../../config';

const ALLOWED = {
  mobility: [null, 'none', 'wheelchair', 'reduced_mobility', 'rollator', 'stroller'],
  city: [null, ...config.cities],
  organizations: [null, ...config.organizations.map((org) => org.id)],
  map: config.maps,
  settingsCollapsed: [true, false],
};

const ACCESSIBILITY_MAPPING = {
  colorblind: 'colour_blind',
  hearingAid: 'hearing_aid',
  visuallyImpaired: 'visual_impairment',
};

class SettingsUtility {
  static mobilitySettings = ALLOWED.mobility;

  static citySettings = ALLOWED.city;

  static mapSettings = ALLOWED.map;

  static defaultMapType = 'servicemap';

  static organizationSettings = ALLOWED.organizations;

  static settingsCollapsed = ALLOWED.settingsCollapsed;

  static accessibilityImpairmentKeys = Object.keys(ACCESSIBILITY_MAPPING);

  static accessibilityImpairmentValues = Object.values(ACCESSIBILITY_MAPPING);

  // AccessibilityRelatedSettings
  // Filter mobility and accessibility settings from null values
  static accessibilityRelatedSettings = [
    ...SettingsUtility.mobilitySettings.filter(v => v),
    ...SettingsUtility.accessibilityImpairmentKeys.filter(v => v),
  ];

  static isValidAccessibilitySenseImpairment(key) {
    return SettingsUtility.accessibilityImpairmentKeys.includes(key);
  }

  static mapValidAccessibilitySenseImpairmentValueToKey(value) {
    return SettingsUtility.accessibilityImpairmentKeys
      .find(key => ACCESSIBILITY_MAPPING[key] === value);
  }

  static isValidMobilitySetting(value) {
    return SettingsUtility.mobilitySettings.includes(value);
  }

  static isValidCitySetting(values) {
    Object.keys(values).forEach((key) => {
      if (!config.cities.includes(key)) {
        throw new Error(`Invalid value for city setting: ${key}`);
      }
    });
    return true;
  }

  static isValidOrganizationSetting(values) {
    Object.keys(values).forEach((key) => {
      if (!config.organizations.map((org) => org.id).includes(key)) {
        throw new Error(`Invalid value for organization setting: ${key}`);
      }
    });
    return true;
  }

  static isValidMapSetting(value) {
    if (!SettingsUtility.mapSettings.includes(value)) {
      throw new Error(`Invalid value for map setting: ${value}`);
    }
    return true;
  }

  static isValidValueForSettingsCollapsed(value) {
    if (!SettingsUtility.settingsCollapsed.includes(value)) {
      throw new Error(`Invalid value for settings open: ${value}`);
    }
    return true;
  }

  /**
   * Transform key to valid api fetched accessibility data key
   * @param {string} key
   */
  static getApiValidDataKey(key) {
    if (Object.keys(ACCESSIBILITY_MAPPING).indexOf(key) < 0) {
      throw new Error(`Invalid key for accessibility mapping: ${key}`);
    }
    return ACCESSIBILITY_MAPPING[key];
  }

  /**
   * Get redux compatible settings object from localStorage
   */
  static getSettingsFromLocalStorage() {
    const mobility = LocalStorageUtility.getItem('mobility');
    const mapType = LocalStorageUtility.getItem('mapType');
    const settings = {
      mobility: mobility === 'null' ? null : mobility,
      mapType: config.maps.includes(mapType) ? mapType : SettingsUtility.defaultMapType,
      colorblind: LocalStorageUtility.getItem('colorblind') === 'true',
      visuallyImpaired: LocalStorageUtility.getItem('visuallyImpaired') === 'true',
      hearingAid: LocalStorageUtility.getItem('hearingAid') === 'true',
      cities: {},
      organizations: {},
      settingsCollapsed: LocalStorageUtility.getItem('settingsCollapsed') === 'true',
    };

    config.cities.forEach((city) => {
      settings.cities[city] = LocalStorageUtility.getItem(city) === 'true';
    });

    config.organizations.forEach((organization) => {
      settings.organizations[organization.id] = LocalStorageUtility.getItem(organization.id) === 'true';
    });

    return settings;
  }

  // Parse current accessibility settings to single shortcoming array
  static parseShortcomingSettings(settings) {
    if (!settings) {
      return [];
    }
    const data = [];
    const { mobility } = settings;
    if (typeof mobility === 'string' && SettingsUtility.isValidMobilitySetting(mobility) && mobility !== 'none') {
      data.push(mobility);
    }

    SettingsUtility.accessibilityImpairmentKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(settings, key) && settings[key]) {
        data.push(ACCESSIBILITY_MAPPING[key]);
      }
    });

    return data;
  }
}

export default SettingsUtility;
