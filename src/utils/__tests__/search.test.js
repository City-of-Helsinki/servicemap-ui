import { removeTrailingNumber } from '../search';

describe('removeTrailingNumber', () => {
  it('removes one or more trailing digits', () => {
    expect(removeTrailingNumber('Mannerheimintie 123')).toBe(
      'Mannerheimintie '
    );
  });

  it('keeps queries without trailing digits unchanged', () => {
    expect(removeTrailingNumber('Mannerheimintie')).toBe('Mannerheimintie');
  });

  it('handles empty values', () => {
    expect(removeTrailingNumber('')).toBe('');
    expect(removeTrailingNumber(null)).toBe(null);
  });
});
