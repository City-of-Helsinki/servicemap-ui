

class DataVisualization {
  STATISTICS_DATASETS = {
    total: 'väestö_yhteensä',
    '0-6': '06vuotiaat',
    '7-17': '717vuotiaat',
    '18-29': '1829vuotiaat',
    '30-49': '3049vuotiaat',
    '50-64': '5064vuotiaat',
    '65+': '65vuotiaat',
  };

  FORECAST_DATASETS = {
    total: 'väestö_yhteensä',
    '0-6': '06vuotiaat',
    '7-17': '717vuotiaat',
    '18-29': '1829vuotiaat',
    '30-49': '3049vuotiaat',
    '50-64': '5064vuotiaat',
    '65+': '65vuotiaat',
  };

  STATISTICS_TYPES = {
    current: 'asuntokunnat',
    forecast: 'ennuste',
  };

  POPULATION_BY_AGE_STRING = '_population_by_age';

  POPULATION_FORECAST_STRING = '_population_forecast';

  CURRENT_YEAR = new Date().getFullYear() - 2;

  FORECAST_YEAR = new Date().getFullYear() + 4;

  CATEGORIES = {
    population_age: `${this.CURRENT_YEAR}${this.POPULATION_BY_AGE_STRING}`,
    population_forecast: `${this.FORECAST_YEAR}${this.POPULATION_FORECAST_STRING}`,
  }

  COLOR = '#000';

  COLOR_CONTRAST = '#EB5C29';

  getYearBasedCategory = forecast => `${forecast ? this.CATEGORIES.population_forecast : this.CATEGORIES.population_age}`

  getStatisticsLayer = name => this.STATISTICS_DATASETS[name];

  getStatisticsType = name => this.STATISTICS_TYPES[name];

  getStatisticsLayers = () => Object.keys(this.STATISTICS_DATASETS);

  getForecastsLayers = () => Object.keys(this.FORECAST_DATASETS);

  isTotal = value => value === 'total'

  isForecast = category => typeof category === 'string' && category.indexOf(this.POPULATION_FORECAST_STRING) > -1;

  isByAge = category => typeof category === 'string' && category.indexOf(this.POPULATION_BY_AGE_STRING) > -1;

  getYearByAge = category => (this.isByAge(category) ? parseInt(category.slice(0, category.indexOf(this.POPULATION_BY_AGE_STRING))) : undefined)

  getYearForecast = category => (this.isForecast(category) ? parseInt(category.slice(0, category.indexOf(this.POPULATION_BY_AGE_STRING))) : undefined);
}

export default new DataVisualization();
