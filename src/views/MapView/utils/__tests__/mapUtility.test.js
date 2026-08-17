import MapUtility from '../mapUtility';

describe('MapUtility', () => {
  it('requires a leaflet map', () => {
    expect(() => new MapUtility({})).toThrow(Error);
  });

  it('requires a unit when centering', () => {
    const utility = new MapUtility({ leaflet: {} });
    expect(() => utility.centerMapToUnit(null)).toThrow(Error);
  });

  it('requires a unit when panning inside', () => {
    const utility = new MapUtility({ leaflet: {} });
    expect(() => utility.panInside(null)).toThrow(Error);
  });
});
