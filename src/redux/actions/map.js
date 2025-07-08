import simpleAction from './simpleActions';

// Map
export const setMapRef = (value) => simpleAction('MAPREF', value);
export const setMeasuringMode = (value) =>
  simpleAction('MEASURING_MODE', value);
export const setBounds = (value) => simpleAction('BOUNDS', value);
