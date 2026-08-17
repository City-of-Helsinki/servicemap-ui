import { getAddressText } from '../address';

describe('getAddressText', () => {
  it('requires a locale text function', () => {
    expect(() => getAddressText({})).toThrow(TypeError);
  });

  it('requires an address name', () => {
    expect(() => getAddressText({}, () => 'text')).toThrow(TypeError);
  });
});
