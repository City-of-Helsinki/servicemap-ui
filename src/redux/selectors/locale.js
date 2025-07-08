import { getLocale } from './user';

// NOTE: this is used only on old class components. useLocaleText should be used instead
// TODO: remove this once class components are replaced with function components
const getLocaleString = (state, obj) => {
  let locale;
  if (typeof state === 'string') {
    locale = state;
  } else {
    locale = getLocale(state);
  }
  // Default rerturned string is the first one lsited (probably always finnish)
  let value = obj[Object.keys(obj)[0]];
  Object.keys(obj).forEach((key) => {
    if (key === locale && obj[key]) {
      value = obj[key];
    }
  });
  return value;
};

export { getLocaleString };
