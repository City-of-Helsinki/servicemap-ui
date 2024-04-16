import { createSelector } from 'reselect';
import config from '../../../config';
import { alphabeticCompare, arraysEqual } from '../../utils';
import SettingsUtility from '../../utils/settings';
import { createMemoizedArraySelector } from './util';

export const selectSettings = state => state.settings;
export const selectCities = state => state.settings.cities;
export const selectOrganizations = state => state.settings.organizations;
export const selectMapType = state => state.settings.mapType;
export const selectMobility = state => state.settings.mobility;
export const selectSenses = createMemoizedArraySelector(
  [selectSettings],
  settings => SettingsUtility.accessibilityImpairmentKeys
    .filter(key => settings[key]),
);

/**
 * Returns an array of city ids.
 */
export const selectSelectedCities = createSelector(
  [selectCities],
  cities => config.cities.filter(c => cities[c]),
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);

const toIds = a => a.map(x => x.id);

/**
 * Returns an array of organization objects.
 */
export const selectSelectedOrganizations = createSelector(
  [selectOrganizations],
  organizations => config.organizations?.filter(org => organizations[org.id]) || [],
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(toIds(a), toIds(b)),
    },
  },
);

export const selectSelectedOrganizationIds = createSelector(
  [selectSelectedOrganizations],
  organizations => toIds(organizations),
  {
    memoizeOptions: {
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);

export const selectSelectedAccessibilitySettings = createSelector(
  [selectSettings],
  (settings) => {
    const selected = SettingsUtility.parseShortcomingSettings(settings);
    selected.sort(alphabeticCompare);
    return selected;
  },
  {
    memoizeOptions: {
      // Check for equal array content, assume non-nil and sorted arrays
      resultEqualityCheck: (a, b) => arraysEqual(a, b),
    },
  },
);
