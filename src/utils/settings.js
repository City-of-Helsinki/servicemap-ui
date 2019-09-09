import LocalStorageUtility from './localStorage';

const ALLOWED = {
  mobility: [null, 'wheelchair', 'reduced_mobility', 'rollator', 'stroller'],
  city: [null, 'helsinki', 'espoo', 'vantaa', 'kauniainen'],
};

const ACCESSIBILITY_MAPPING = {
  colorblind: 'colour_blind',
  hearingAid: 'hearing_aid',
  visuallyImpaired: 'visual_impairment',
};

class SettingsUtility {
  static mobilitySettings = ALLOWED.mobility;

  static citySettings = ALLOWED.city;

  static accessibilityImpairmentKeys = Object.keys(ACCESSIBILITY_MAPPING).map(
    key => (key),
  );

  static isValidAccessibilitySenseImpairment(key) {
    if (this.accessibilityImpairmentKeys.indexOf(key) < 0) {
      throw new Error(`Invalid value for accessibility sense setting: ${key}`);
    }
    return true;
  }

  static isValidMobilitySetting(value) {
    if (this.mobilitySettings.indexOf(value) < 0) {
      throw new Error(`Invalid value for mobility setting: ${value}`);
    }
    return true;
  }

  static isValidCitySetting(value) {
    if (this.citySettings.indexOf(value) < 0) {
      throw new Error(`Invalid value for city setting: ${value}`);
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
   * Get redux compatible settings object from localStorage
   */
  static getSettingsFromLocalStorage() {
    const mobility = LocalStorageUtility.getItem('mobility');
    const settings = {
      mobility: mobility === 'null' ? null : mobility,
      colorblind: LocalStorageUtility.getItem('colorblind') === 'true',
      visuallyImpaired: LocalStorageUtility.getItem('visuallyImpaired') === 'true',
      hearingAid: LocalStorageUtility.getItem('hearingAid') === 'true',
      helsinki: LocalStorageUtility.getItem('helsinki') === 'true',
      espoo: LocalStorageUtility.getItem('espoo') === 'true',
      vantaa: LocalStorageUtility.getItem('vantaa') === 'true',
      kauniainen: LocalStorageUtility.getItem('kauniainen') === 'true',
    };

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

    this.accessibilityImpairmentKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(settings, key) && settings[key]) {
        data.push(ACCESSIBILITY_MAPPING[key]);
      }
    });

    return data;
  }

  // Check accessibility settings have been activated
  static hasActiveAccessibilitySettings(settings) {
    const activeSettings = this.parseShortcomingSettings(settings);
    return activeSettings && activeSettings.length;
  }
}

export default SettingsUtility;
