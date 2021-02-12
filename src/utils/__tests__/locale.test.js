import LocaleUtility from '../locale';

describe('LocaleUtility tests', () => {
  it('Checks that locale is valid', () => {
    expect(LocaleUtility.isValidLocale('fi')).toEqual(true);
  });

  it('Checks that locale is invalid', () => {
    expect(LocaleUtility.isValidLocale('invalid')).toEqual(false);
  });

  it('Returns correct available locales', () => {
    const keys = ['fi', 'en', 'sv'];

    expect(LocaleUtility.availableLocales).toEqual(keys);
  });
});
