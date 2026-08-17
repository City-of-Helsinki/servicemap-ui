import {
  cities,
  colorblind,
  hearingAid,
  mapType,
  mobility,
  organizations,
  settingsCollapsed,
  visuallyImpaired,
} from '../settings';

describe('settings reducers', () => {
  it.each([
    ['hearingAid', hearingAid, 'HEARING', false],
    ['visuallyImpaired', visuallyImpaired, 'SIGHT', false],
    ['colorblind', colorblind, 'COLORBLIND', false],
    ['mobility', mobility, 'MOBILITY', null],
    ['mapType', mapType, 'MAP_TYPE', null],
  ])('handles %s selections', (_name, reducer, prefix, initial) => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toBe(initial);
    expect(
      reducer(undefined, {
        type: `${prefix}_SET_SELECTION`,
        selection: 'value',
      })
    ).toBe('value');
  });

  it('handles cities, organizations, and collapsed settings', () => {
    const selection = { helsinki: true };
    expect(cities(undefined, { type: 'CITY_SET_SELECTION', selection })).toBe(
      selection
    );
    expect(
      organizations(undefined, {
        type: 'ORGANIZATION_SET_SELECTION',
        selection,
      })
    ).toBe(selection);
    expect(
      settingsCollapsed(undefined, {
        type: 'SETTINGS_OPENED',
        selection: false,
      })
    ).toBe(false);
  });
});
