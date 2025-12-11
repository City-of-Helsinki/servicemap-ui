import { describe, expect, it } from 'vitest';

import { calculateLegendVisibility } from '../mapLegendUtils';

describe('MapLegend', () => {
  describe('Legend visibility logic', () => {
    it('shows nothing when no data', () => {
      const show = calculateLegendVisibility(
        [],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(Object.values(show).every((v) => !v)).toBe(true);
    });

    it('shows unit when single unit exists', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'unit' }],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.unit).toBe(true);
      expect(show.event).toBe(false);
      expect(show.cluster).toBe(false);
    });

    it('shows event when single event exists', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'event' }],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.event).toBe(true);
      expect(show.unit).toBe(false);
    });

    it('shows cluster when multiple units exist', () => {
      const show = calculateLegendVisibility(
        [
          { id: 1, type: 'unit' },
          { id: 2, type: 'unit' },
        ],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.cluster).toBe(true);
      expect(show.unit).toBe(true);
      expect(show.event).toBe(false);
    });

    it('shows entrances when unit has entrances', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'unit', entrances: [{ id: 'e1' }] }],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.entrances).toBe(true);
    });

    it('shows user location when provided', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'unit' }],
        {},
        { lat: 60.1, lng: 24.9 },
        'unit',
        null,
        [],
        []
      );
      expect(show.userLocation).toBe(true);
    });

    it('shows coordinate when URL has coordinates', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'unit' }],
        { search: '?lat=60.1&lon=24.9' },
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.coordinate).toBe(true);
    });

    it('shows address on address page', () => {
      const show = calculateLegendVisibility(
        [],
        {},
        null,
        'address',
        null,
        [],
        []
      );
      expect(show.address).toBe(true);
    });

    it('shows address on area page with address data', () => {
      const show = calculateLegendVisibility(
        [],
        {},
        null,
        'area',
        { address: 'Test Street 1' },
        [],
        []
      );
      expect(show.address).toBe(true);
    });

    it('shows area when district data exists', () => {
      const show = calculateLegendVisibility(
        [],
        {},
        null,
        'area',
        null,
        [{ id: 'd1' }],
        []
      );
      expect(show.area).toBe(true);
    });

    it('shows area when statistical districts exist', () => {
      const show = calculateLegendVisibility(
        [],
        {},
        null,
        'area',
        null,
        [],
        [{ id: 's1' }]
      );
      expect(show.area).toBe(true);
    });

    it('does not show event when events array is empty', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'unit', events: [] }],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.event).toBe(false);
      expect(show.unit).toBe(true);
    });

    it('shows event when unit has events', () => {
      const show = calculateLegendVisibility(
        [{ id: 1, type: 'unit', events: [{ id: 'e1' }] }],
        {},
        null,
        'unit',
        null,
        [],
        []
      );
      expect(show.event).toBe(true);
      expect(show.unit).toBe(false);
    });
  });
});
