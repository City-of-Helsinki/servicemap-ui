import { resolveParkingAreaId } from '../parking';

describe('parking', () => {
  describe('resolveParkingAreaId', () => {

    const helsinkiTests = [
      { input: { municipality: 'helsinki', extra: { class: '1' } }, output: '1' },
      { input: { municipality: 'helsinki', extra: { class: '2' } }, output: '2' },
      { input: { municipality: 'helsinki', extra: { class: '3' } }, output: '3' },
      { input: { municipality: 'helsinki', extra: { class: '4' } }, output: '4' },
      { input: { municipality: 'helsinki', extra: { class: '5' } }, output: '5' },
      { input: { municipality: 'helsinki', extra: { class: '6' } }, output: '6' },
      { input: { municipality: 'helsinki', extra: { class: '7' } }, output: '7' },
    ];

    helsinkiTests
      .forEach(({ input, output }) => {
        it(`should give area id ${output} from the extra.class prop of Helsinki area`, () => {
          const id = resolveParkingAreaId(input);
          expect(id).toEqual(output);
        });
      });

    const vantaaTests = [
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: '12h-24h' } },
        output: '12h-24h/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: '4h-11h' } },
        output: '4h-11h/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: '2h-3h' } },
        output: '2h-3h/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: 'Ei rajoitusta' } },
        output: 'Ei rajoitusta/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: 'Lyhytaikainen' } },
        output: 'Lyhytaikainen/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: 'Maksullinen' } },
        output: 'Maksullinen/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: 'Muu' } },
        output: 'Muu/passenger_car',
      },
      {
        input: { municipality: 'vantaa', type: 'parking_area', extra: { tyyppi: 'Varattu päivisin' } },
        output: 'Varattu päivisin/passenger_car',
      },

      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: '12h-24h' } },
        output: '12h-24h/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: '4h-11h' } },
        output: '4h-11h/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: '2h-3h' } },
        output: '2h-3h/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: 'Ei rajoitusta' } },
        output: 'Ei rajoitusta/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: 'Lyhytaikainen' } },
        output: 'Lyhytaikainen/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: 'Maksullinen' } },
        output: 'Maksullinen/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: 'Muu' } },
        output: 'Muu/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_street_parking_area', extra: { tyyppi: 'Varattu päivisin' } },
        output: 'Varattu päivisin/heavy_traffic',
      },

      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: '12h-24h' } },
        output: '12h-24h/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: '4h-11h' } },
        output: '4h-11h/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: '2h-3h' } },
        output: '2h-3h/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: 'Ei rajoitusta' } },
        output: 'Ei rajoitusta/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: 'Lyhytaikainen' } },
        output: 'Lyhytaikainen/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: 'Maksullinen' } },
        output: 'Maksullinen/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: 'Muu' } },
        output: 'Muu/heavy_traffic',
      },
      {
        input: { municipality: 'vantaa', type: 'hgv_parking_area', extra: { tyyppi: 'Varattu päivisin' } },
        output: 'Varattu päivisin/heavy_traffic',
      },
    ];

    vantaaTests
      .forEach(({ input, output }) => {
        it(`should give area id ${output} by combining extra.tyyppi prop and one of [passenger_car, heavy_traffic]`, () => {
          const id = resolveParkingAreaId(input);
          expect(id).toEqual(output);
        });
      });

    const vantaaOtherTypes = [
      {
        input: { municipality: 'vantaa', type: 'hgv_no_parking_area', extra: { tyyppi: '12h-24h' } },
        output: 'hgv_no_parking_area',
      },
      {
        input: { municipality: 'vantaa', type: 'park_and_ride_area', extra: { tyyppi: '12h-24h' } },
        output: 'park_and_ride_area',
      },
    ];
    vantaaOtherTypes
      .forEach(({ input, output }) => {
        it(`should give area id ${output} when the type is ${input.type}`, () => {
          const id = resolveParkingAreaId(input);
          expect(id).toEqual(output);
        });
      });

    it('should return null when municipality is not helsinki or vantaa', () => {
      const area = {
        municipality: 'espoo',
        type: 'parking_area',
        extra: { class: '5', tyyppi: '12h-24h' },
      };
      const id = resolveParkingAreaId(area);
      expect(id).toEqual(null);
    });
  });
});
