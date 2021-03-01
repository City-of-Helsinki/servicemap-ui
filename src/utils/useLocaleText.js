import { useCallback } from 'react';
import { useSelector } from 'react-redux';

// This returns correct string from text object according to locale
const getLocaleString = (locale, obj) => {
  // Default rerturned string is the first one listed (probably always finnish)
  let value = obj[Object.keys(obj)[0]];
  Object.keys(obj).forEach((key) => {
    if (key === locale) {
      value = obj[key];
    }
  });
  return value;
};

const useLocaleText = () => {
  const locale = useSelector(state => state.user.locale);
  return useCallback(obj => getLocaleString(locale, obj), [locale]);
};

export default useLocaleText;
