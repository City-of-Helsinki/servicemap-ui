
const getLocale = store => store.user.locale;

// This returns correct string according to locale
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
    if (key === locale) {
      value = obj[key];
    }
  });
  return value;
};

export {
  getLocaleString,
  getLocale,
};
