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
    const data = [[[60.1, 24.9]]];

    const result = swapCoordinates(data);

    // coordinate[0] (60.1) >= coordinate[1] (24.9) -> [lng, lat] (which for this
    // mocked coordsToLatLng resolves back to the original pair order)
    expect(result).toEqual([[[60.1, 24.9]]]);
  });

  it('mutates and returns the same array reference it received', () => {
    const data = [
      [
        [24.9, 60.1],
        [24.95, 60.2],
      ],
    ];

    const result = swapCoordinates(data);

    expect(result).toBe(data);
  });
});
