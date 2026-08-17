import UnitHelper from '../unitHelper';

describe('UnitHelper.unitElementClick', () => {
  it('requires a navigator', () => {
    expect(() => UnitHelper.unitElementClick(null, 1)).toThrow(TypeError);
  });

  it('requires a unit', () => {
    const navigator = { push: vi.fn(), replace: vi.fn() };
    expect(() => UnitHelper.unitElementClick(navigator, null)).toThrow(
      TypeError
    );
  });
});
