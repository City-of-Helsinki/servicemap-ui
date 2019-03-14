import en from '../../i18n/translations/en';
import fi from '../../i18n/translations/fi';
import sv from '../../i18n/translations/sv';

const getLocale = store => store.locale;

// This returns correct string according to locale
const translate = (state, id) => {
  const locale = getLocale(state);
  const translations = { fi, en, sv };
  return translations[locale][id];
};

export {
  translate,
  getLocale,
};
