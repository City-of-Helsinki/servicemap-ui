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

const basicSelection = (state = initialState, action, prefix) => {
  if (action.type === `${prefix}_SET_SELECTION`) {
    return action.selection;
  }
  return state;
};

const basicSelectionNullInitial = (state = null, action, prefix) => {
  if (action.type === `${prefix}_SET_SELECTION`) {
    return action.selection;
  }
  return state;
};

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

export const settingsCollapsed = (state = settingsCollapsedInitially, action) => {
  if (action.type === 'SETTINGS_OPENED') {
    return action.selection;
  }
  return state;
};

export const hearingAid = (state, action) => basicSelection(state, action, 'HEARING');

export const visuallyImpaired = (state, action) => basicSelection(state, action, 'SIGHT');

export const colorblind = (state, action) => basicSelection(state, action, 'COLORBLIND');

export const mobility = (state, action) => basicSelectionNullInitial(state, action, 'MOBILITY');

export const mapType = (state, action) => basicSelectionNullInitial(state, action, 'MAP_TYPE');
