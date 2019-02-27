import localeFi from 'react-intl/locale-data/fi';
import localeEn from 'react-intl/locale-data/en';
import localeSe from 'react-intl/locale-data/se';
import { addLocaleData } from 'react-intl';
import messagesFi from './translations/fi';
import messagesEn from './translations/en';
import messagesSe from './translations/se';

// Translation messages for React Intl
const messages = {
  fi: { text: 'Suomi', messages: messagesFi },
  en: { text: 'English', messages: messagesEn },
  se: { text: 'Svenska', messages: messagesSe },
};

// Mutable class keys
const mutableKeys = [
  'locale',
  'fallbackLocale',
];

/**
 * Internationalization
 * Handle locale changes and get appropriate
 * localization data for React Intl
 * */
class i18n {
  constructor(props) {
    addLocaleData([...localeFi, ...localeEn, ...localeSe]); // Add locale data to react-intl
    const instance = this;
    if (props) {
      Object.keys(props).forEach((key) => {
        // Check that key is mutable and value exists
        if (mutableKeys.includes(key) && props[key]) {
          instance[key] = props[key];
        }
      });
    }
  }

  // Options
  locale = 'fi';

  fallbackLocale = 'fi';

  availableLocales = Object.keys(messages);

  // Change locale
  changeLocale = (locale) => {
    if (this.isValidLocale(locale)) {
      this.locale = locale;
    }
  }

  // Check if locale is valid
  isValidLocale = (locale = this.locale) => {
    if (this.locale && Object.prototype.hasOwnProperty.call(messages, locale)) {
      return true;
    }
    return false;
  }

  getAvailableLocales = () => this.availableLocales

  localeText = (locale = this.locale) => messages[locale] && messages[locale].text

  // Get data object with locale and messages (for React Intl)
  data = () => {
    const newLocale = this.isValidLocale() ? this.locale : this.fallbackLocale;
    const newMessages = this.isValidLocale()
      ? messages[this.locale].messages : messages[this.fallbackLocale].messages;
    return {
      locale: newLocale,
      messages: newMessages,
    };
  }
}

export default i18n;
