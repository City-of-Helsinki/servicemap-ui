import user, { initialState } from '../user';

describe('user reducer', () => {
  it('uses the initial state', () => {
    expect(user(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it.each([
    ['SET_LOCALE', 'locale', 'sv'],
    ['SET_CURRENT_PAGE', 'page', 'search'],
    ['SET_THEME', 'theme', 'dark'],
  ])('updates %s', (type, key, value) => {
    expect(user(undefined, { type, [key]: value })[key]).toBe(value);
  });

  it('marks initial load complete and updates positions', () => {
    expect(user(undefined, { type: 'SET_INITIAL_LOAD' }).initialLoad).toBe(
      true
    );
    const position = { coordinates: [60, 24], allowed: true };
    const customPosition = { coordinates: [61, 25], addressData: {} };
    expect(user(undefined, { type: 'SET_POSITION', position }).position).toBe(
      position
    );
    expect(
      user(undefined, { type: 'SET_CUSTOM_POSITION', customPosition })
        .customPosition
    ).toBe(customPosition);
  });
});
