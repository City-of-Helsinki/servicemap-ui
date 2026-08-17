import dataVisualization from '../dataVisualization';

describe('DataVisualization year parsing', () => {
  it('parses current population category years', () => {
    expect(dataVisualization.getYearByAge('2024_population_by_age')).toBe(2024);
  });

  it('parses forecast category years', () => {
    expect(
      dataVisualization.getYearForecast(
        '2025_population_by_age_population_forecast'
      )
    ).toBe(2025);
  });
});
