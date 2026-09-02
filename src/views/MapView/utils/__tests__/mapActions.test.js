import { describe, expect, it, vi } from 'vitest';

vi.mock('leaflet', () => ({
  default: {
    LatLngBounds: vi.fn(function MockLatLngBounds(corners) {
      this.corners = corners;
      this.contains = vi.fn(() => true);
    }),
    latLng: vi.fn((coords) => ({ lat: coords[0], lng: coords[1] })),
    latLngBounds: vi.fn((sw, ne) => ({ sw, ne })),
    GeoJSON: {
      coordsToLatLng: vi.fn((coord) => ({ lat: coord[1], lng: coord[0] })),
    },
  },
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: vi.fn(() => ({ search: '' })),
  };
});

vi.mock('../../../../utils/mapUtility', () => ({
  mapHasMapPane: vi.fn(() => true),
}));

vi.mock('../../../../utils/path', () => ({
  isEmbed: vi.fn(() => false),
}));

vi.mock('@turf/point-on-feature', () => ({
  default: vi.fn(() => ({ geometry: { coordinates: [24.9, 60.1] } })),
}));

const { mapHasMapPane } = await import('../../../../utils/mapUtility');
const {
  fitBbox,
  fitUnitsToMap,
  focusDistrict,
  focusDistricts,
  focusToPosition,
  getBoundsFromBbox,
  panViewToBounds,
  refreshMapSize,
} = await import('../mapActions');

const createMockMap = (overrides = {}) => ({
  options: {
    maxBounds: {
      getNorthWest: () => ({ lat: 61, lng: 24 }),
      getSouthEast: () => ({ lat: 60, lng: 25 }),
    },
    maxZoom: 18,
  },
  invalidateSize: vi.fn(),
  fitBounds: vi.fn(),
  setView: vi.fn(),
  getBounds: vi.fn(() => ({ contains: vi.fn(() => false) })),
  ...overrides,
});

describe('mapActions', () => {
  describe('refreshMapSize', () => {
    it('invalidates map size when the map has a map pane', () => {
      const map = createMockMap();
      refreshMapSize(map);
      expect(map.invalidateSize).toHaveBeenCalled();
    });

    it('does nothing when the map has no map pane', () => {
      mapHasMapPane.mockReturnValueOnce(false);
      const map = createMockMap();
      refreshMapSize(map);
      expect(map.invalidateSize).not.toHaveBeenCalled();
    });

    it('does nothing when map is falsy', () => {
      expect(() => refreshMapSize(null)).not.toThrow();
    });
  });

  describe('focusToPosition', () => {
    it('sets the view using the given zoom level', () => {
      const map = createMockMap();
      focusToPosition(map, [24.9, 60.1], 12);
      expect(map.setView).toHaveBeenCalledWith([60.1, 24.9], 12);
    });

    it('falls back to maxZoom - 1 when no zoom is given', () => {
      const map = createMockMap();
      focusToPosition(map, [24.9, 60.1]);
      expect(map.setView).toHaveBeenCalledWith([60.1, 24.9], 17);
    });
  });

  describe('focusDistrict', () => {
    it('fits bounds using swapped coordinates', () => {
      const map = createMockMap();
      focusDistrict(map, [
        [
          [24.9, 60.1],
          [24.95, 60.2],
        ],
      ]);
      expect(map.fitBounds).toHaveBeenCalled();
    });
  });

  describe('focusDistricts', () => {
    it('filters out districts without a boundary and fits the rest', () => {
      const map = createMockMap();
      focusDistricts(map, [
        { boundary: null },
        {
          boundary: {
            coordinates: [
              [
                [24.9, 60.1],
                [24.95, 60.2],
              ],
            ],
          },
        },
      ]);
      expect(map.fitBounds).toHaveBeenCalled();
    });
  });

  describe('getBoundsFromBbox', () => {
    it('returns null when bbox is not given', () => {
      expect(getBoundsFromBbox(null)).toBeNull();
    });

    it('builds bounds from a bbox array', () => {
      const result = getBoundsFromBbox([24, 60, 25, 61]);
      expect(result).toEqual({
        sw: { lat: 24, lng: 60 },
        ne: { lat: 25, lng: 61 },
      });
    });
  });

  describe('fitBbox', () => {
    it('does nothing when map is missing', () => {
      expect(() => fitBbox(null, [24, 60, 25, 61])).not.toThrow();
    });

    it('does nothing when bbox does not have 4 values', () => {
      const map = createMockMap();
      fitBbox(map, [24, 60]);
      expect(map.fitBounds).not.toHaveBeenCalled();
    });

    it('fits the map to the bounds built from the bbox', () => {
      const map = createMockMap();
      fitBbox(map, [24, 60, 25, 61]);
      expect(map.fitBounds).toHaveBeenCalled();
    });
  });

  describe('fitUnitsToMap', () => {
    it('fits units that are within map bounds', async () => {
      vi.useFakeTimers();
      const map = createMockMap();
      const units = [
        {
          object_type: 'unit',
          location: { coordinates: [24.9, 60.1] },
        },
      ];

      fitUnitsToMap(units, map);
      vi.runAllTimers();

      expect(map.fitBounds).toHaveBeenCalled();
      vi.useRealTimers();
    });

    it('ignores non-unit-typed entries without throwing', () => {
      vi.useFakeTimers();
      const map = createMockMap();
      const units = [{ object_type: 'service' }, { object_type: 'unit' }];

      expect(() => fitUnitsToMap(units, map)).not.toThrow();
      vi.runAllTimers();
      vi.useRealTimers();
    });
  });

  describe('panViewToBounds', () => {
    it('fits the map to the geometry group when the point is outside map bounds', () => {
      const map = createMockMap();
      panViewToBounds(map, { coordinates: [] }, [1, 2]);
      expect(map.fitBounds).toHaveBeenCalledWith([1, 2]);
    });

    it('fits the map to the geometry coordinates when no group is given', () => {
      const map = createMockMap();
      panViewToBounds(map, { coordinates: [1, 2] });
      expect(map.fitBounds).toHaveBeenCalledWith([1, 2]);
    });

    it('does not move the map when the point is already within bounds', () => {
      const map = createMockMap({
        getBounds: vi.fn(() => ({ contains: vi.fn(() => true) })),
      });
      panViewToBounds(map, { coordinates: [] });
      expect(map.fitBounds).not.toHaveBeenCalled();
    });
  });
});
