import I18n, { messages } from '../index';

it('Changes locale successfully', () => {
  const i18n = new I18n();
  const locale = 'en';
  i18n.changeLocale(locale);

  expect(i18n.locale).toEqual(locale);
});

it('Doesn\'t change locale if invalid locale given', () => {
  const i18n = new I18n();
  const oldLocale = i18n.locale;
  i18n.changeLocale('fien');

  expect(i18n.locale).toEqual(oldLocale);
});

it('Checks that locale is valid', () => {
  const i18n = new I18n();

  expect(i18n.isValidLocale('fi')).toEqual(true);
});

it('Checks that locale is invalid', () => {
  const i18n = new I18n();

  expect(i18n.isValidLocale('invalid')).toEqual(false);
});

it('Returns correct locale texts', () => {
  const i18n = new I18n();
  const keys = Object.keys(messages);

  keys.forEach((key) => {
    const localeText = i18n.localeText(key);
    const expectedLocaleText = messages[key].text;
    expect(localeText).toEqual(expectedLocaleText);
  });
});

it('Returns correct available locales', () => {
  const i18n = new I18n();
  const keys = Object.keys(messages);
  const availableLocales = i18n.getAvailableLocales();
  expect(availableLocales).toEqual(keys);
});

it('Returns correct data', () => {
  const i18n = new I18n();
  const data = i18n.data();

  expect(data.locale).toEqual(i18n.fallbackLocale);
  expect(data.messages).toBeDefined();
});
