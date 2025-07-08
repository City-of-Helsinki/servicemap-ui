import ExternalMapUrlCreator from '../externalMapUrlCreator';

const orto = 'ortographic';

const testDefaults = (url) => {
  const splitIndex = url.indexOf('?');
  const baseUrl = url.slice(0, splitIndex);
  expect(baseUrl).toBe('https://kartta.hel.fi/3d/');
  const queryString = url.slice(splitIndex);
  const urlSearchParams = new URLSearchParams(queryString);
  const keys = Array.from(urlSearchParams.keys());
  expect(keys).toHaveLength(7);
  // constants params
  expect(urlSearchParams.get('startingmap')).toBe('Cesium Map');
  expect(urlSearchParams.get('pitch')).toBe('-45.00');
  expect(urlSearchParams.get('heading')).toBe('360.00');
  expect(urlSearchParams.get('roll')).toBe('0.00');
  // these should exist
  expect(keys.indexOf('groundPosition')).toBeGreaterThan(-1);
  expect(keys.indexOf('distance')).toBeGreaterThan(-1);
  return urlSearchParams;
};

describe('ExternalMapUrlCreator', () => {
  const distances1 = [
    { level: 9, distance: 256000 },
    { level: 10, distance: 128000 },
    { level: 11, distance: 64000 },
    { level: 12, distance: 32000 },
    { level: 13, distance: 16000 },
    { level: 14, distance: 8000 },
    { level: 15, distance: 4000 },
    { level: 16, distance: 2000 },
    { level: 17, distance: 1000 },
    { level: 18, distance: 500 },
  ];
  const distanceTests = [
    {
      mapType: 'ortographic',
      distances: [
        { level: 3, distance: 52800 },
        { level: 4, distance: 26400 },
        { level: 5, distance: 13200 },
        { level: 6, distance: 6600 },
        { level: 7, distance: 3300 },
        { level: 8, distance: 1650 },
        { level: 9, distance: 825 },
        { level: 10, distance: 412.5 },
      ],
    },
    {
      mapType: 'servicemap',
      distances: distances1,
    },
    {
      mapType: 'accessible_map',
      distances: distances1,
    },
    {
      mapType: 'guidemap',
      distances: [
        { level: 8, distance: 53600 },
        { level: 9, distance: 26800 },
        { level: 10, distance: 13400 },
        { level: 11, distance: 6700 },
        { level: 12, distance: 3350 },
        { level: 13, distance: 1675 },
        { level: 14, distance: 837.5 },
        { level: 15, distance: 418.75 },
      ],
    },
  ];

  distanceTests.forEach(({ mapType, distances }) => {
    distances.forEach(({ level, distance }) => {
      it(`should produce distance ${distance} with zoom level ${level} for map ${mapType}`, () => {
        const url = ExternalMapUrlCreator.createHelsinki3DMapUrl(
          60,
          25,
          level,
          mapType,
          'fi'
        );
        const urlSearchParams = testDefaults(url);
        expect(urlSearchParams.get('lang')).toBe('fi');
        expect(urlSearchParams.get('groundPosition')).toBe('60,25,0');
        expect(urlSearchParams.get('distance')).toBe(`${distance}`);
      });
    });
  });

  it('should set coordinates', () => {
    const url = ExternalMapUrlCreator.createHelsinki3DMapUrl(
      57.458,
      22.9964,
      6,
      orto,
      'fi'
    );
    const urlSearchParams = testDefaults(url);
    expect(urlSearchParams.get('lang')).toBe('fi');
    expect(urlSearchParams.get('groundPosition')).toBe('57.458,22.9964,0');
    expect(urlSearchParams.get('distance')).toBe('6600');
  });

  it('should set lang', () => {
    const url = ExternalMapUrlCreator.createHelsinki3DMapUrl(
      54,
      22,
      6,
      orto,
      'no'
    );
    const urlSearchParams = testDefaults(url);
    expect(urlSearchParams.get('lang')).toBe('no');
    expect(urlSearchParams.get('groundPosition')).toBe('54,22,0');
    expect(urlSearchParams.get('distance')).toBe('6600');
  });
});
