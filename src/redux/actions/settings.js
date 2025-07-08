import config from '../../../config';
import LocalStorageUtility from '../../utils/localStorage';
import SettingsUtility from '../../utils/settings';

const setAccessibilitySelection =
  (prefix, key, value) => async (dispatch, getState) => {
    const { settings } = getState();
    const settingsHasKey = Object.prototype.hasOwnProperty.call(settings, key);
    const keyIsValid = SettingsUtility.isValidAccessibilitySenseImpairment(key);
    if (settingsHasKey && keyIsValid) {
      const newValue = typeof value !== 'undefined' ? !!value : !settings[key];
      dispatch({
        type: `${prefix}_SET_SELECTION`,
        selection: newValue,
      });
      LocalStorageUtility.saveItem(key, newValue); // Save value to localStorage
    }
  };

const setRadioSelection = (prefix) => (selection) => ({
  type: `${prefix}_SET_SELECTION`,
  selection,
});

const setMobilitySetting = (setting) => async (dispatch) => {
  if (SettingsUtility.isValidMobilitySetting(setting)) {
    dispatch(setRadioSelection('MOBILITY')(setting));
    LocalStorageUtility.saveItem('mobility', setting); // Save value to localStorage
  }
};

const setMapTypeSetting = (setting) => async (dispatch) => {
  if (SettingsUtility.isValidMapSetting(setting)) {
    dispatch(setRadioSelection('MAP_TYPE')(setting));
    LocalStorageUtility.saveItem('mapType', setting); // Save value to localStorage
  }
};

export const setSettingsAccordionCollapsed =
  (collapsed) => async (dispatch) => {
    if (SettingsUtility.isValidValueForSettingsCollapsed(collapsed)) {
      LocalStorageUtility.saveItem('settingsCollapsed', collapsed);
      dispatch({ type: 'SETTINGS_OPENED', selection: collapsed });
    }
  };

export const toggleCity = (values) => async (dispatch) => {
  if (!SettingsUtility.isValidCitySetting(values)) {
    return;
  }
  const citySettings = {};
  config.cities.forEach((city) => {
    citySettings[city] = !!values[city];
  });

  dispatch({
    type: 'CITY_SET_SELECTION',
    selection: citySettings,
  });
  config.cities.forEach((city) => {
    LocalStorageUtility.saveItem(city, values[city]); // Save values to localStorage
  });
};

export const toggleOrganization = (values) => async (dispatch) => {
  if (!SettingsUtility.isValidOrganizationSetting(values)) {
    return;
  }
  const organizationSettings = {};
  config.organizations.forEach((organization) => {
    organizationSettings[organization.id] = !!values[organization.id];
  });
  dispatch({
    type: 'ORGANIZATION_SET_SELECTION',
    selection: organizationSettings,
  });
  config.organizations.forEach((organization) => {
    LocalStorageUtility.saveItem(organization.id, values[organization.id]);
  });
};

export const setCities = (cities) => {
  const newCityValues = {};
  config.cities.forEach((city) => {
    newCityValues[city] = cities.includes(city);
  });
  return toggleCity(newCityValues);
};

export const setOrganizations = (orgIds) => {
  const newOrgValues = {};
  config.organizations.forEach((org) => {
    newOrgValues[org.id] = orgIds.includes(org.id);
  });
  return toggleOrganization(newOrgValues);
};

export const toggleHearingAid = (value = undefined) =>
  setAccessibilitySelection('HEARING', 'hearingAid', value);

export const toggleVisuallyImpaired = (value = undefined) =>
  setAccessibilitySelection('SIGHT', 'visuallyImpaired', value);

export const toggleColorblind = (value = undefined) =>
  setAccessibilitySelection('COLORBLIND', 'colorblind', value);

export const setMobility = (value) => setMobilitySetting(value);

export const setMapType = (value) => setMapTypeSetting(value);

export const resetSenseSettings = () => async (dispatch) => {
  dispatch(toggleHearingAid(false));
  dispatch(toggleColorblind(false));
  dispatch(toggleVisuallyImpaired(false));
};

export const resetAccessibilitySettings = () => async (dispatch) => {
  dispatch(setMobility(null));
  dispatch(toggleHearingAid(false));
  dispatch(toggleColorblind(false));
  dispatch(toggleVisuallyImpaired(false));
};

export const resetCitySettings = () => async (dispatch) => {
  const citySettings = {};
  config.cities.forEach((city) => {
    citySettings[city] = false;
  });
  dispatch(toggleCity(citySettings));
};

export const resetOrganizationSettings = () => async (dispatch) => {
  const orgSettings = {};
  config.organizations.forEach((org) => {
    orgSettings[org.id] = false;
  });
  dispatch(toggleOrganization(orgSettings));
};

export const activateSetting = (setting, value) => async (dispatch) => {
  switch (setting) {
    case 'mobility':
      if (SettingsUtility.isValidMobilitySetting(value)) {
        dispatch(setMobility(value));
      }
      break;
    case 'hearingAid':
      dispatch(toggleHearingAid(true));
      break;
    case 'colorblind':
      dispatch(toggleColorblind(true));
      break;
    case 'visuallyImpaired':
      dispatch(toggleVisuallyImpaired(true));
      break;
    default:
  }
};
