import config from '../../../config';

const initialState = false;
const settingsCollapsedInitially = true;

const cityInitialState = {};
config.cities.forEach((city) => {
  cityInitialState[city] = false;
});

const organizationInitialState = {};
config.organizations.forEach((organization) => {
  organizationInitialState[organization.id] = false;
});

function basicSelectionFunc(action, prefix, state) {
  if (action.type === `${prefix}_SET_SELECTION`) {
    return action.selection;
  }
  return state;
}

const basicSelection = (action, prefix, state = initialState) =>
  basicSelectionFunc(action, prefix, state);

const basicSelectionNullInitial = (action, prefix, state = null) =>
  basicSelectionFunc(action, prefix, state);

export const cities = (state = cityInitialState, action) => {
  if (action.type === 'CITY_SET_SELECTION') {
    return action.selection;
  }
  return state;
};

export const organizations = (state = organizationInitialState, action) => {
  if (action.type === 'ORGANIZATION_SET_SELECTION') {
    return action.selection;
  }
  return state;
};

export const settingsCollapsed = (
  state = settingsCollapsedInitially,
  action
) => {
  if (action.type === 'SETTINGS_OPENED') {
    return action.selection;
  }
  return state;
};

export const hearingAid = (state, action) =>
  basicSelection(action, 'HEARING', state);

export const visuallyImpaired = (state, action) =>
  basicSelection(action, 'SIGHT', state);

export const colorblind = (state, action) =>
  basicSelection(action, 'COLORBLIND', state);

export const mobility = (state, action) =>
  basicSelectionNullInitial(action, 'MOBILITY', state);

export const mapType = (state, action) =>
  basicSelectionNullInitial(action, 'MAP_TYPE', state);
