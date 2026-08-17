import { calculateProportion } from '../statisticalDistrict';

describe('calculateProportion', () => {
  it('calculates a percentage for numeric values', () => {
    expect(calculateProportion(200, 50)).toBe(25);
  });

  it('returns zero for non-numeric values', () => {
    expect(calculateProportion('200', 50)).toBe(0);
    expect(calculateProportion(200, null)).toBe(0);
  });
});
