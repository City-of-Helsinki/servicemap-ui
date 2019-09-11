import SettingsUtility from '../../utils/settings';
import LocalStorageUtility from '../../utils/localStorage';
import simpleAction from './simpleActions';

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
    LocalStorageUtility.saveItem(key, !value); // Save value to localStorage
  }
};

const setRadioSelection = prefix => selection => ({
  type: `${prefix}_SET_SELECTION`,
  selection,
});

const setMobilitySetting = setting => async (dispatch) => {
  if (SettingsUtility.isValidMobilitySetting(setting)) {
    dispatch(setRadioSelection('MOBILITY')(setting));
    LocalStorageUtility.saveItem('mobility', setting); // Save value to localStorage
  }
};


export const toggleHearingAid = () => setSingleSelection('HEARING', 'hearingAid');

export const toggleVisuallyImpaired = () => setSingleSelection('SIGHT', 'visuallyImpaired');

export const toggleColorblind = () => setSingleSelection('COLORBLIND', 'colorblind');

export const setMobility = value => setMobilitySetting(value);

export const toggleSettings = value => simpleAction('SETTINGS_TOGGLE', value);
