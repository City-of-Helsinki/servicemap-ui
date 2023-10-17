import { createSelector } from 'reselect';
import config from '../../../config';
import SettingsUtility from '../../utils/settings';

export const selectSettings = state => state.settings;
export const getCitySettings = state => state.settings.cities;
export const selectCities = state => state.settings.cities;
export const selectOrganizations = state => state.settings.organizations;

export const selectSelectedCities = createSelector(
  [selectCities],
  cities => config.cities.filter(c => cities[c]),
);

export const selectSelectedOrganizations = createSelector(
  [selectOrganizations],
  organizations => config.organizations?.filter(org => organizations[org.id]),
);

export const selectSelectedAccessibilitySettings = createSelector(
  [selectSettings],
  (settings) => {
    const selected = SettingsUtility.parseShortcomingSettings(settings);
    selected.sort();
    return selected;
  },
  {
    memoizeOptions: {
      // Check for equal array content, assume non-nil and sorted arrays
      resultEqualityCheck: (a, b) => {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i += 1) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      },
    },
  },
);
