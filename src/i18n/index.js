// import localeFi from 'react-intl/locale-data/fi';
// import localeEn from 'react-intl/locale-data/en';
// import localeSv from 'react-intl/locale-data/sv';

// import { addLocaleData } from 'react-intl';
import messagesFi from './fi';
import messagesEn from './en';
import messagesSv from './sv';

// Translation messages for React Intl
export const messages = {
  fi: { text: 'Suomeksi', messages: messagesFi },
  en: { text: 'In English', messages: messagesEn },
  sv: { text: 'På svenska', messages: messagesSv },
};

// Mutable class keys
export const mutableKeys = [
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
    // addLocaleData([...localeFi, ...localeEn, ...localeSv]); // Add locale data to react-intl
    const instance = this;

    // Set given options
    if (props) {
      Object.keys(props).forEach((key) => {
        // Check that key is mutable and value exists
        if (mutableKeys.includes(key) && props[key]) {
          instance[key] = props[key];
        }
      });
    }

    // Validate locale
    this.changeLocale(this.locale);
  }

  // Options
  fallbackLocale = 'fi';

  locale = this.fallbackLocale;

  availableLocales = Object.keys(messages);

  // Change locale
  changeLocale = (locale) => {
    if (this.isValidLocale(locale)) {
      this.locale = locale;
    } else {
      const baseLocale = locale.split('-')[0];
      if (this.isValidLocale(baseLocale)) {
        this.locale = baseLocale;
      }
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
