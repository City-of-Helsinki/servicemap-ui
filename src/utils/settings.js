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

  static organizationSettings = ALLOWED.organizations;

  static settingsCollapsed = ALLOWED.settingsCollapsed;

  static accessibilityImpairmentKeys = Object.keys(ACCESSIBILITY_MAPPING).map(
    key => (key),
  );

  // AccessibilityRelatedSettings
  // Filter mobility and accessibility settings from null values
  static accessibilityRelatedSettings = [
    ...SettingsUtility.mobilitySettings.filter(v => v),
    ...SettingsUtility.accessibilityImpairmentKeys.filter(v => v),
  ];

  static isValidAccessibilitySenseImpairment(key) {
    if (SettingsUtility.accessibilityImpairmentKeys.indexOf(key) < 0) {
      return false;
    }
    return true;
  }

  static mapValidAccessibilitySenseImpairmentValueToKey(value) {
    return SettingsUtility.accessibilityImpairmentKeys
      .find(key => ACCESSIBILITY_MAPPING[key] === value);
  }

  static isValidMobilitySetting(value) {
    if (SettingsUtility.mobilitySettings.indexOf(value) < 0) {
      return false;
    }
    return true;
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
    if (SettingsUtility.mapSettings.indexOf(value) < 0) {
      throw new Error(`Invalid value for map setting: ${value}`);
    }
    return true;
  }

  static isValidValueForSettingsCollapsed(value) {
    if (SettingsUtility.settingsCollapsed.indexOf(value) < 0) {
      throw new Error(`Invalid value for settings open: ${value}`);
    }
    return true;
  }

  static getAccessibilityShortcomingKey(key) {
    if (Object.prototype.hasOwnProperty.call(ACCESSIBILITY_MAPPING, key)) {
      return ACCESSIBILITY_MAPPING[key];
    }
    return key;
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
   * Return active city settings from redux state
   * @param {*} citySettings - City settings from state
   * @returns {array} - Array of city settings which are active
   */
  static getActiveCitySettings(citySettings) {
    const result = [];
    SettingsUtility.citySettings.forEach((city) => {
      if (
        Object.prototype.hasOwnProperty.call(citySettings, (city))
        && citySettings[city]
      ) {
        result.push(city);
      }
    });
    return result;
  }

  /**
   * Get redux compatible settings object from localStorage
   */
  static getSettingsFromLocalStorage() {
    const mobility = LocalStorageUtility.getItem('mobility');
    const mapType = LocalStorageUtility.getItem('mapType');
    const settings = {
      mobility: mobility === 'null' ? null : mobility,
      mapType: !mapType ? 'servicemap' : mapType,
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
    if (typeof mobility === 'string' && mobility !== 'none') {
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
