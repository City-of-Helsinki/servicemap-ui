import locale_fi from 'react-intl/locale-data/fi';
import locale_en from 'react-intl/locale-data/en';
import locale_se from 'react-intl/locale-data/se';
import messages_fi from "./translations/fi";
import messages_en from "./translations/en";
import messages_se from "./translations/se";
import { addLocaleData } from 'react-intl';

// Translation messages for React Intl
const messages = {
  'fi': messages_fi,
  'en': messages_en,
  'se': messages_se
};

// Mutable class keys
const mutableKeys = [
  'locale',
  'fallback_locale'
];

/**
 * Internationalization
 * 
 * Handle locale changes and get appropriate
 * localization data for React Intl 
 **/
class i18n {
  constructor(props) {
    addLocaleData([...locale_fi, ...locale_en, ...locale_se]); // Add locale data to react-intl
    const _this = this;
    if (props) {
      Object.keys(props).forEach(function (key) {
        // Check that key is mutable and value exists
        if (mutableKeys.includes(key) && props[key]) {
          _this[key] = props[key];
        }
      });
    }
  }
  // Options
  locale = 'fi';
  fallback_locale = 'fi';

  // Change locale
  changeLocale = (locale) => {
    if (this.isValidLocale(locale)) {
      this.locale = locale;
    }
  }

  // Check if locale is valid
  isValidLocale = (locale = this.locale) => {
    if (this.locale && messages.hasOwnProperty(this.locale)) {
      return true;
    }
    return false;
  }

  // Get data object with locale and messages (for React Intl)
  data = () => {
    const newLocale = this.isValidLocale() ? this.locale : this.fallback_locale;
    const newMessages = this.isValidLocale() ? messages[this.locale] : messages[this.fallback_locale];
    return {
      locale: newLocale,
      messages: newMessages
    }
  }
}

export default i18n;