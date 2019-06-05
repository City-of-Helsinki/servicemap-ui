import SettingsUtility from '../../utils/settings';

const setSingleSelection = (prefix, key) => async (dispatch, getState) => {
  const { settings } = getState();
  const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
  const keyIsValid = SettingsUtility.isValidAccessibilitySenseImpairment(key);
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


export const toggleHearingAid = () => setSingleSelection('HEARING', 'hearingAid');

export const toggleVisuallyImpaired = () => setSingleSelection('SIGHT', 'visuallyImpaired');

export const toggleColorblind = () => setSingleSelection('COLORBLIND', 'colorblind');

export const setMobility = value => setMobilitySetting(value);
