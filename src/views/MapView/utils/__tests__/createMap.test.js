import { describe, expect, it, vi } from 'vitest';

import createMap from '../createMap';

const mockPoint = vi.fn((coords) => ({ point: coords }));
const mockBounds = vi.fn((sw, ne) => ({ sw, ne }));
const mockProjCRS = vi.fn(function MockProjCRS(crsName, projDef, options) {
  this.crsName = crsName;
  this.projDef = projDef;
  this.options = options;
});

vi.mock('leaflet', () => ({
  default: {
    CRS: { EPSG3857: 'EPSG3857' },
    point: (...args) => mockPoint(...args),
    bounds: (...args) => mockBounds(...args),
    Proj: {
      get CRS() {
        return mockProjCRS;
      },
    },
  },
}));

describe('createMap', () => {
  it('returns EPSG3857 crs for map types without a custom layer (e.g. servicemap)', () => {
    const result = createMap('servicemap', 'fi');

    expect(result.crs).toBe('EPSG3857');
    expect(result.options).toBeDefined();
  });

  it('falls back to the default map type for an unknown/unsupported map type', () => {
    const result = createMap('not-a-real-map-type', 'fi');

    expect(result.crs).toBe('EPSG3857');
  });

  it('builds a custom Proj CRS for map types that define a tile layer (e.g. guidemap)', () => {
    const result = createMap('guidemap', 'fi');

    expect(mockPoint).toHaveBeenCalled();
    expect(mockBounds).toHaveBeenCalled();
    expect(mockProjCRS).toHaveBeenCalled();
    expect(result.crs).toBeInstanceOf(mockProjCRS);
    expect(result.crs.crsName).toBe('EPSG:3879');
  });
});
