import { getSelectedStatisticalDistricts } from '../statisticalDistrict';

describe('getSelectedStatisticalDistricts', () => {
  it('parses selected values and proportions as numbers', () => {
    const state = {
      settings: { cities: {} },
      statisticalDistrict: {
        districts: {
          selection: {
            forecast: false,
            proportionScales: { min: 0, max: 10 },
            section: 'population',
          },
          data: [
            {
              municipality: 'helsinki',
              name: { fi: 'Test district' },
              data: {
                '2024_population_by_age': {
                  population: { value: '12', proportion: '4' },
                },
              },
            },
          ],
        },
      },
    };

    const [district] = getSelectedStatisticalDistricts(state);

    expect(district.selectedValue).toBe(12);
    expect(district.selectedProportion).toBe(4);
  });
});
