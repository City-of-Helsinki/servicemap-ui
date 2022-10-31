import { getLocaleString } from './useLocaleText';

// eslint-disable-next-line import/prefer-default-export
export const unitsSortAlphabetically = (locale, reverse = false) => (
  (a, b) => {
    const aName = getLocaleString(locale, a.name).toLowerCase();
    const bName = getLocaleString(locale, b.name).toLowerCase();
    if (reverse) {
      if (aName > bName) { return -1; }
      if (aName < bName) { return 1; }
    } else {
      if (aName > bName) { return 1; }
      if (aName < bName) { return -1; }
    }
    return 0;
  }
);
