import ExternalMapUrlCreator from '../externalMapUrlCreator';

const testDefaults = (url) => {
  const splitIndex = url.indexOf('?');
  const baseUrl = url.slice(0, splitIndex);
  expect(baseUrl).toBe('https://kartta.hel.fi/3d/');
  const queryString = url.slice(splitIndex);
  const urlSearchParams = new URLSearchParams(queryString);
  const keys = Array.from(urlSearchParams.keys());
  expect(keys).toHaveLength(8);
  // constants params
  expect(urlSearchParams.get('startingmap')).toBe('Cesium Map');
  expect(urlSearchParams.get('lang')).toBe('en');
  expect(urlSearchParams.get('pitch')).toBe('-90.00');
  expect(urlSearchParams.get('heading')).toBe('360.00');
  expect(urlSearchParams.get('roll')).toBe('0.00#/');
  // these should exist
  expect(keys.indexOf('cameraPosition')).toBeGreaterThan(-1);
  expect(keys.indexOf('groundPosition')).toBeGreaterThan(-1);
  expect(keys.indexOf('distance')).toBeGreaterThan(-1);
  return urlSearchParams;
};

describe('ExternalMapUrlCreator', () => {
  [
    { level: 3, distance: 52800 },
    { level: 4, distance: 26400 },
    { level: 5, distance: 13200 },
    { level: 6, distance: 6600 },
    { level: 7, distance: 3300 },
    { level: 8, distance: 1650 },
    { level: 9, distance: 825 },
    { level: 10, distance: 412.5 },
  ]
    .forEach(({ level, distance }) => {
      it(`should produce distance ${distance} with  zoom level ${level}`, () => {
        const url = ExternalMapUrlCreator.create3DMapUrl(60, 25, level);
        const urlSearchParams = testDefaults(url);
        expect(urlSearchParams.get('cameraPosition')).toBe(`60,25,${distance}`);
        expect(urlSearchParams.get('groundPosition')).toBe('60,25,0');
        expect(urlSearchParams.get('distance')).toBe(`${distance}`);
      });
    });

  it('should set coordinates', () => {
    const url = ExternalMapUrlCreator.create3DMapUrl(57.458, 22.9964, 6);
    const urlSearchParams = testDefaults(url);
    expect(urlSearchParams.get('cameraPosition')).toBe('57.458,22.9964,6600');
    expect(urlSearchParams.get('groundPosition')).toBe('57.458,22.9964,0');
    expect(urlSearchParams.get('distance')).toBe('6600');
  })
});
