
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
}

export default SettingsUtility;
