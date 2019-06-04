import SettingsUtility from '../../utils/settings';

const setSingleSelection = (prefix, key) => async (dispatch, getState) => {
  const { settings } = getState();
  const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
  const keyIsValid = SettingsUtility.isValidAccessibilityImpairment(key);
  if (settingsHasKey && keyIsValid) {
    const value = settings[key];
    dispatch({
      type: `${prefix}_SET_SELECTION`,
      selection: !value,
    });
  }
};

const setRadioSelection = prefix => selection => ({
  type: `${prefix}_SET_SELECTION`,
  selection,
});

const setMobilitySetting = setting => async (dispatch) => {
  if (SettingsUtility.isValidMobilitySetting(setting)) {
    dispatch(setRadioSelection('MOBILITY')(setting));
  }
};


export const toggleHearingAid = () => setSingleSelection('HEARING', 'hearing_aid');

export const toggleVisuallyImpaired = () => setSingleSelection('SIGHT', 'visually_impaired');

export const toggleColorblind = () => setSingleSelection('COLOR', 'colorblind');

export const setMobility = value => setMobilitySetting(value);
