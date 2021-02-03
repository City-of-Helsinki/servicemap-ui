import { useSelector } from 'react-redux';
import LocalStorageUtility from './localStorage';
import config from '../../config';

const ALLOWED = {
  mobility: [null, 'wheelchair', 'reduced_mobility', 'rollator', 'stroller'],
  city: [null, ...config.cities],
  map: config.maps,
};

const ACCESSIBILITY_MAPPING = {
  colorblind: 'colour_blind',
  hearingAid: 'hearing_aid',
  visuallyImpaired: 'visual_impairment',
};

// Return active accessibility settings
export const useAcccessibilitySettings = () => {
  const userSettings = useSelector(state => state.settings);
  const accessibiliySettingsValues = [
    userSettings.mobility,
    userSettings.colorblind,
    userSettings.hearingAid,
    userSettings.visuallyImpaired,
  ].filter(i => (i !== false && i !== null));

  return accessibiliySettingsValues;
};

class SettingsUtility {
  static mobilitySettings = ALLOWED.mobility;

  static citySettings = ALLOWED.city;

  static mapSettings = ALLOWED.map;

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
      throw new Error(`Invalid value for accessibility sense setting: ${key}`);
    }
    return true;
  }

  static isValidMobilitySetting(value) {
    if (SettingsUtility.mobilitySettings.indexOf(value) < 0) {
      throw new Error(`Invalid value for mobility setting: ${value}`);
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

  static isValidMapSetting(value) {
    if (SettingsUtility.mapSettings.indexOf(value) < 0) {
      throw new Error(`Invalid value for map setting: ${value}`);
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
   * @param {*} state
   * @returns {array} - Array of city settings which are active
   */
  static getActiveCitySettings(state) {
    const result = [];
    const citySettings = state?.settings?.cities;
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
    };

    config.cities.forEach((city) => {
      settings.cities[city] = LocalStorageUtility.getItem(city) === 'true';
    });

    return settings;
  }

  // Parse current accessibility settings to single shortcoming array
  static parseShortcomingSettings(settings) {
    if (!settings) {
      return null;
    }
    const data = [];
    const { mobility } = settings;
    if (typeof mobility === 'string') {
      data.push(mobility);
    }

    SettingsUtility.accessibilityImpairmentKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(settings, key) && settings[key]) {
        data.push(ACCESSIBILITY_MAPPING[key]);
      }
    });

    return data;
  }

  // Check accessibility settings have been activated
  static hasActiveAccessibilitySettings(settings) {
    const activeSettings = SettingsUtility.parseShortcomingSettings(settings);
    return activeSettings && activeSettings.length;
  }
}

export default SettingsUtility;
