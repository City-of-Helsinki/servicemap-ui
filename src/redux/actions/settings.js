import SettingsUtility from '../../utils/settings';
import LocalStorageUtility from '../../utils/localStorage';
import simpleAction from './simpleActions';

const setAccessibilitySelection = (prefix, key) => async (dispatch, getState) => {
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

const setCitySelection = (prefix, key) => async (dispatch, getState) => {
  const { settings } = getState();
  const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
  const keyIsValid = SettingsUtility.isValidCitySetting(key);
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

const setMapTypeSetting = setting => async (dispatch) => {
  if (SettingsUtility.isValidMapSetting(setting)) {
    dispatch(setRadioSelection('MAP_TYPE')(setting));
    LocalStorageUtility.saveItem('mapType', setting); // Save value to localStorage
  }
};


export const toggleHearingAid = () => setAccessibilitySelection('HEARING', 'hearingAid');

export const toggleVisuallyImpaired = () => setAccessibilitySelection('SIGHT', 'visuallyImpaired');

export const toggleColorblind = () => setAccessibilitySelection('COLORBLIND', 'colorblind');

export const setMobility = value => setMobilitySetting(value);

export const toggleHelsinki = () => setCitySelection('HELSINKI', 'helsinki');

export const toggleEspoo = () => setCitySelection('ESPOO', 'espoo');

export const toggleVantaa = () => setCitySelection('VANTAA', 'vantaa');

export const toggleKauniainen = () => setCitySelection('KAUNIAINEN', 'kauniainen');

export const toggleSettings = value => simpleAction('SETTINGS_TOGGLE', value);

export const setMapType = value => setMapTypeSetting(value);
