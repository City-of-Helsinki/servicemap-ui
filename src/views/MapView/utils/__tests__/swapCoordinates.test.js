import { describe, expect, it, vi } from 'vitest';

import swapCoordinates from '../swapCoordinates';

vi.mock('leaflet', () => ({
  default: {
    GeoJSON: {
      coordsToLatLng: vi.fn((coord) => ({ lat: coord[1], lng: coord[0] })),
    },
  },
}));

describe('swapCoordinates', () => {
  it('swaps lng-lat coordinate pairs to lat-lng', () => {
    const data = [
      [
        [24.9, 60.1],
        [24.95, 60.2],
      ],
    ];

    const result = swapCoordinates(data);

    // coordinate[0] (24.9) < coordinate[1] (60.1) -> [lat, lng]
    expect(result).toEqual([
      [
        [60.1, 24.9],
        [60.2, 24.95],
      ],
    ]);
  });

  it('handles coordinates where the first value is larger than the second', () => {
    const data = [
      [
        [60.1, 24.9],
        [60.2, 24.8],
      ],
    ];

    const result = swapCoordinates(data);

    // Values already in lat-lng order are preserved.
    expect(result).toEqual([
      [
        [60.1, 24.9],
        [60.2, 24.8],
      ],
    ]);
  });

  it('returns a new array with swapped coordinates', () => {
    const data = [
      [
        [24.9, 60.1],
        [24.95, 60.2],
      ],
    ];

    const result = swapCoordinates(data);

    expect(result).not.toBe(data);
    expect(result).toEqual([
      [
        [60.1, 24.9],
        [60.2, 24.95],
      ],
    ]);
  });

  it('ignores invalid rings and coordinate pairs', () => {
    const result = swapCoordinates([
      'invalid ring',
      [[24.9], ['24.95', 60.2], [24.95, Number.NaN], [24.95, 60.2]],
    ]);

    expect(result).toEqual([]);
  });

  it('returns an empty array for non-array input', () => {
    expect(swapCoordinates(null)).toEqual([]);
    expect(swapCoordinates({})).toEqual([]);
  });
});
