import SettingsUtility from '../../utils/settings';
import LocalStorageUtility from '../../utils/localStorage';
import simpleAction from './simpleActions';
import config from '../../../config';

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

export const toggleCity = values => async (dispatch) => {
  const keyIsValid = SettingsUtility.isValidCitySetting(values);
  const citySettings = {};
  config.cities.forEach((city) => { citySettings[city] = values[city]; });

  if (keyIsValid) {
    dispatch({
      type: 'CITY_SET_SELECTION',
      selection: citySettings,
    });
    config.cities.forEach((city) => {
      LocalStorageUtility.saveItem(city, values[city]); // Save values to localStorage
    });
  }
};

export const toggleHearingAid = () => setAccessibilitySelection('HEARING', 'hearingAid');

export const toggleVisuallyImpaired = () => setAccessibilitySelection('SIGHT', 'visuallyImpaired');

export const toggleColorblind = () => setAccessibilitySelection('COLORBLIND', 'colorblind');

export const setMobility = value => setMobilitySetting(value);

export const toggleSettings = value => async (dispatch, getState) => {
  const { settings } = getState();
  const { toggled } = settings;
  const newValue = (!value || value === toggled) ? null : value;

  dispatch(simpleAction('SETTINGS_TOGGLE', newValue));
};

export const setMapType = value => setMapTypeSetting(value);
