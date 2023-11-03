import { createSelector } from 'reselect';
import config from '../../../config';
import { arraysEqual } from '../../utils';
import SettingsUtility from '../../utils/settings';

export const selectSettings = state => state.settings;
export const getCitySettings = state => state.settings.cities;
export const selectCities = state => state.settings.cities;
export const selectOrganizations = state => state.settings.organizations;

/**
 * Returns an array of city ids.
 */
export const selectSelectedCities = createSelector(
  [selectCities],
  cities => config.cities.filter(c => cities[c]),
);

/**
 * Returns an array of organization objects.
 */
export const selectSelectedOrganizations = createSelector(
  [selectOrganizations],
  organizations => config.organizations?.filter(org => organizations[org.id]),
);

export const selectSelectedAccessibilitySettings = createSelector(
  [selectSettings],
  (settings) => {
    const selected = SettingsUtility.parseShortcomingSettings(settings);
    selected.sort((a, b) => +(a > b));
    return selected;
  },
  {
    memoizeOptions: {
      // Check for equal array content, assume non-nil and sorted arrays
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);
