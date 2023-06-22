import { getUnitCount } from '../units';

describe('getUnitCount', () => {
  const testUnit = {
    unit_count: {
      total: 71,
      municipality: {
        nowayork: 6,
        stoggenholm: 8,
        kristiania: 12,
        hochimincity_aka_saigon: 44,
      },
      organization: {
        educationByro: 12,
        sportsByro: 15,
        byroByro: 19,
      },
    },
  };

  it('should get count for city', () => {
    expect(getUnitCount(testUnit, 'nowayork')).toBe(6);
    expect(getUnitCount(testUnit, 'stoggenholm')).toBe(8);
    expect(getUnitCount(testUnit, 'hochimincity_aka_saigon')).toBe(44);

    expect(getUnitCount(testUnit, 'helsinki')).toBe(0);
  });

  it('should get count for organization', () => {
    expect(getUnitCount(testUnit, 'educationByro')).toBe(12);
    expect(getUnitCount(testUnit, 'byroByro')).toBe(19);

    expect(getUnitCount(testUnit, 'espoo')).toBe(0);
  });

  it('should not choke on shitty input', () => {
    expect(getUnitCount(testUnit, '')).toBe(0);
    expect(getUnitCount(testUnit, null)).toBe(0);
    expect(getUnitCount(testUnit, undefined)).toBe(0);
    expect(getUnitCount(testUnit)).toBe(0);
    expect(getUnitCount(testUnit, {})).toBe(0);

    expect(getUnitCount(null, 'helsinki')).toBe(0);
    expect(getUnitCount(undefined, 'helsinki')).toBe(0);
    expect(getUnitCount({}, 'helsinki')).toBe(0);
  });
});
