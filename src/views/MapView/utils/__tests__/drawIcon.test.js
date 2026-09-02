import { describe, expect, it, vi } from 'vitest';

vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn((options) => ({ options })),
  },
}));

const {
  default: drawMarkerIcon,
  drawEntranceMarkerIcon,
  drawUnitIcon,
  NumberCircleMaker,
} = await import('../drawIcon');

describe('drawIcon', () => {
  describe('drawMarkerIcon', () => {
    it('builds a default (non-event, non-contrast) unit marker icon', () => {
      const icon = drawMarkerIcon(false, null, false, 'my-class');

      expect(icon.options.iconSize).toEqual([30, 30]);
      expect(icon.options.iconAnchor).toEqual([15, 15]);
      expect(icon.options.className).toBe('unitMarker my-class');
      expect(icon.options.popupAnchor).toEqual([-3, 11]);
    });

    it('builds an event marker icon with event-specific size/anchor', () => {
      const icon = drawMarkerIcon(true, [1, 2]);

      expect(icon.options.iconSize).toEqual([36, 36]);
      expect(icon.options.iconAnchor).toEqual([14, 19]);
      expect(icon.options.popupAnchor).toEqual([1, 2]);
    });

    it('uses the contrast icon variants when contrast is true', () => {
      const defaultIcon = drawMarkerIcon(false, null, false);
      const contrastIcon = drawMarkerIcon(false, null, true);

      expect(contrastIcon.options.iconUrl).not.toBe(
        defaultIcon.options.iconUrl
      );
    });
  });

  describe('drawEntranceMarkerIcon', () => {
    it('builds an entrance marker icon with fixed size/anchor', () => {
      const icon = drawEntranceMarkerIcon(false, 'extra');

      expect(icon.options.iconSize).toEqual([24, 24]);
      expect(icon.options.iconAnchor).toEqual([12, 12]);
      expect(icon.options.className).toBe('entranceMarker extra');
    });

    it('uses the contrast icon when contrast is true', () => {
      const defaultIcon = drawEntranceMarkerIcon(false);
      const contrastIcon = drawEntranceMarkerIcon(true);

      expect(contrastIcon.options.iconUrl).not.toBe(
        defaultIcon.options.iconUrl
      );
    });
  });

  describe('drawUnitIcon', () => {
    it('returns a data URL for the drawn berry icon', () => {
      const result = drawUnitIcon('#ff0000', 90);

      expect(result).toBe('data:image/png;base64,00');
    });

    it('clamps curve values outside of the accepted range', () => {
      expect(() => drawUnitIcon('#ff0000', 200)).not.toThrow();
      expect(() => drawUnitIcon('#ff0000', 10)).not.toThrow();
      expect(() => drawUnitIcon('#ff0000')).not.toThrow();
    });
  });

  describe('NumberCircleMaker', () => {
    it('draws a numbered circle onto the given canvas context', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const marker = new NumberCircleMaker(40);

      expect(() => marker.drawNumberedCircle(ctx, 5)).not.toThrow();
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalled();
    });
  });
});
