import messagesEn from '../i18n/en';
import messagesFi from '../i18n/fi';
import messagesSv from '../i18n/sv';

/**
 * LocaleUtility class is a helper object for handling locale
 * related functionality.
 */
class LocaleUtility {
  // Default locale
  static defaultLocale = 'fi';

  // Translation messages
  static messages = {
    fi: messagesFi,
    en: messagesEn,
    sv: messagesSv,
  };

  static availableLocales = Object.keys(LocaleUtility.messages);

  // Figure out if give locale is valid locale
  static isValidLocale = (locale) =>
    locale &&
    Object.prototype.hasOwnProperty.call(LocaleUtility.messages, locale);

  // Get data object with locale and messages (for React Intl)
  static intlData = (locale) => {
    const newLocale = LocaleUtility.isValidLocale(locale)
      ? locale
      : LocaleUtility.defaultLocale;
    const newMessages = LocaleUtility.isValidLocale(locale)
      ? LocaleUtility.messages[locale]
      : LocaleUtility.messages[LocaleUtility.defaultLocale];
    return {
      locale: newLocale,
      messages: newMessages,
    };
  };
}

export default LocaleUtility;
