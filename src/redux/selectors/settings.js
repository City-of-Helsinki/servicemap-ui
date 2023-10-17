import { createSelector } from 'reselect';
import config from '../../../config';

export const getCitySettings = state => state.settings.cities;
const selectCities = state => state.settings.cities;
const selectOrganizations = state => state.settings.organizations;

export const selectSelectedCities = createSelector(
  [selectCities],
  cities => config.cities.filter(c => cities[c]),
);

export const selectSelectedOrganizations = createSelector(
  [selectOrganizations],
  organizations => config.organizations?.filter(org => organizations[org.id]),
);
