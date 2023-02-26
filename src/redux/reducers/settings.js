import config from '../../../config';

const initialState = false;
const settingsCollapsedInitially = true;

const cityInitialState = {};
config.cities.forEach((city) => {
  cityInitialState[city] = false;
});

const basicSelection = (state = initialState, action, prefix) => {
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

export const settingsCollapsed = (state = settingsCollapsedInitially, action) => {
  if (action.type === 'SETTINGS_OPENED') {
      return action.selection;
  }
  return state;
}

export const hearingAid = (state, action) => basicSelection(state, action, 'HEARING');

export const visuallyImpaired = (state, action) => basicSelection(state, action, 'SIGHT');

export const colorblind = (state, action) => basicSelection(state, action, 'COLORBLIND');

export const mobility = (state, action) => basicSelection(state, action, 'MOBILITY');

export const mapType = (state, action) => basicSelection(state, action, 'MAP_TYPE');
