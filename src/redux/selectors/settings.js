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
/**
 * Return array of selected senses.
 */
export const selectSenses = createMemoizedArraySelector(
  [selectSettings],
  settings => SettingsUtility.accessibilityImpairmentKeys
    .filter(key => settings[key]),
);

/**
 * Returns an array of city ids.
 */
export const selectSelectedCities = createMemoizedArraySelector(
  [selectCities],
  cities => config.cities.filter(c => cities[c]),
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

export const selectSelectedOrganizationIds = createMemoizedArraySelector(
  [selectSelectedOrganizations],
  organizations => toIds(organizations),
);

export const selectSelectedAccessibilitySettings = createMemoizedArraySelector(
  [selectSettings],
  (settings) => {
    const selected = SettingsUtility.parseShortcomingSettings(settings);
    selected.sort(alphabeticCompare);
    return selected;
  },
);
