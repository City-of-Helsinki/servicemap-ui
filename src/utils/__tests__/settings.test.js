import { alphabeticCompare } from '../index';
import SettingsUtility from '../settings';

describe('SettingsUtility.isValidAccessibilitySenseImpairment', () => {
  it('', () => {
    expect(
      SettingsUtility.isValidAccessibilitySenseImpairment('colorblind')
    ).toBe(true);
    expect(
      SettingsUtility.isValidAccessibilitySenseImpairment('hearingAid')
    ).toBe(true);
    expect(
      SettingsUtility.isValidAccessibilitySenseImpairment('visuallyImpaired')
    ).toBe(true);
    expect(
      SettingsUtility.isValidAccessibilitySenseImpairment('colour_blind')
    ).toBe(false);
    expect(
      SettingsUtility.isValidAccessibilitySenseImpairment('hearing_aid')
    ).toBe(false);
    expect(
      SettingsUtility.isValidAccessibilitySenseImpairment('visually_impaired')
    ).toBe(false);
    expect(SettingsUtility.isValidAccessibilitySenseImpairment(null)).toBe(
      false
    );
    expect(SettingsUtility.isValidAccessibilitySenseImpairment(undefined)).toBe(
      false
    );
  });
});

describe('SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey', () => {
  it('', () => {
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(
        'colorblind'
      )
    ).toBe(undefined);
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(
        'hearingAid'
      )
    ).toBe(undefined);
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(
        'visuallyImpaired'
      )
    ).toBe(undefined);
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(
        'colour_blind'
      )
    ).toBe('colorblind');
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(
        'hearing_aid'
      )
    ).toBe('hearingAid');
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(
        'visually_impaired'
      )
    ).toBe('visuallyImpaired');
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(null)
    ).toBe(undefined);
    expect(
      SettingsUtility.mapValidAccessibilitySenseImpairmentValueToKey(undefined)
    ).toBe(undefined);
  });
});

describe('SettingsUtility.isValidMobilitySetting', () => {
  it('', () => {
    expect(SettingsUtility.isValidMobilitySetting(null)).toBe(true);
    expect(SettingsUtility.isValidMobilitySetting('none')).toBe(true);
    expect(SettingsUtility.isValidMobilitySetting('wheelchair')).toBe(true);
    expect(SettingsUtility.isValidMobilitySetting('reduced_mobility')).toBe(
      true
    );
    expect(SettingsUtility.isValidMobilitySetting('rollator')).toBe(true);
    expect(SettingsUtility.isValidMobilitySetting('stroller')).toBe(true);
    expect(SettingsUtility.isValidMobilitySetting(undefined)).toBe(false);
    expect(SettingsUtility.isValidMobilitySetting('colorblind')).toBe(false);
    expect(SettingsUtility.isValidMobilitySetting('colour_blind')).toBe(false);
  });
});

describe('SettingsUtility.parseShortcomingSettings', () => {
  it('', () => {
    expect(SettingsUtility.parseShortcomingSettings(null)).toEqual([]);
    expect(SettingsUtility.parseShortcomingSettings(undefined)).toEqual([]);
    expect(SettingsUtility.parseShortcomingSettings({})).toEqual([]);
    expect(
      SettingsUtility.parseShortcomingSettings({ mobility: 'none' })
    ).toEqual([]);
    expect(
      SettingsUtility.parseShortcomingSettings({
        mobility: 'none',
        colorblind: true,
        visuallyImpaired: false,
      })
    ).toEqual(['colour_blind']);
    let result = SettingsUtility.parseShortcomingSettings({
      mobility: 'wheelchair',
      colorblind: true,
      visuallyImpaired: true,
      hearing_aid: true,
    }).sort(alphabeticCompare);
    expect(result).toEqual(['colour_blind', 'visually_impaired', 'wheelchair']);
    result = SettingsUtility.parseShortcomingSettings({
      mobility: 'hearingAid',
      colorblind: false,
      visuallyImpaired: true,
      hearing_aid: true,
    }).sort(alphabeticCompare);
    expect(result).toEqual(['visually_impaired']);
  });
});
