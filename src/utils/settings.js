
const ALLOWED = {
  mobility: [null, 'wheelchair', 'reduced_mobility', 'rollator', 'stroller'],
  city: [null, 'helsinki', 'espoo', 'vantaa', 'kauniainen'],
};

const ACCESSIBILITY_MAPPING = {
  colorblind: 'colour_blind',
  hearing: 'hearing_aid',
  visual: 'visual_impairment',
};

class SettingsUtillity {
  static mobilitySettings = ALLOWED.mobility;

  static citySettings = ALLOWED.city;

  static accessibilityImpairments = Object.keys(ACCESSIBILITY_MAPPING).map(
    key => (ACCESSIBILITY_MAPPING[key]),
  );

  static isValidAccessibilityImpairment(key) {
    return this.accessibilityImpairments.indexOf(key) > -1;
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
}

export default SettingsUtillity;
