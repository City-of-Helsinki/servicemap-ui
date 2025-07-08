class DataVisualization {
  STATISTICS_DATASETS = {
    ALL: 'väestö_yhteensä',
    '0-6': '06vuotiaat',
    '7-15': '715vuotiaat',
    '16-18': '1618vuotiaat',
    '19-34': '1934vuotiaat',
    '35-64': '3564vuotiaat',
    '65-': '65vuotiaat',
  };

  FORECAST_DATASETS = {
    ALL: 'väestö_yhteensä',
    '0-6': '06vuotiaat',
    '7-17': '717vuotiaat',
    '18-29': '1829vuotiaat',
    '30-49': '3049vuotiaat',
    '50-64': '5064vuotiaat',
    '65-': '65vuotiaat',
  };

  STATISTICS_TYPES = {
    current: 'asuntokunnat',
    forecast: 'ennuste',
  };

  POPULATION_BY_AGE_STRING = '_population_by_age';

  POPULATION_FORECAST_STRING = '_population_forecast';

  COLOR = '#000';

  COLOR_CONTRAST = '#EB5C29';

  /**
   * This return latest category in data. Usually there is only one category for each of current and
   * forecast data.
   * In practice if forecast=true then this will
   * 1. collect the keys of data
   * 2. select those keys that are of form x_population_forecast
   * 3. select latest of the keys
   * 4. return value of data by that key
   * If forecast=false then it's the same but keys are of the form x_population_by_age
   * @param data
   * @param forecast
   * @returns {string|undefined}
   */
  getCategory = (data, forecast) => {
    if (!data) {
      return undefined;
    }
    const categories = Object.keys(data).filter((category) =>
      forecast ? this.isForecast(category) : this.isByAge(category)
    );
    const category = categories.reduce((mostRecent, category) => {
      if (!mostRecent) {
        return category;
      }
      const mostRecentYear = forecast
        ? this.getYearForecast(mostRecent)
        : this.getYearByAge(mostRecent);
      const categoryYear = forecast
        ? this.getYearForecast(category)
        : this.getYearByAge(category);
      return mostRecentYear > categoryYear ? mostRecent : category;
    }, undefined);
    return data[category];
  };

  getStatisticsLayer = (name) => this.STATISTICS_DATASETS[name];

  getStatisticsType = (name) => this.STATISTICS_TYPES[name];

  getStatisticsLayers = () => Object.keys(this.STATISTICS_DATASETS);

  getForecastsLayers = () => Object.keys(this.FORECAST_DATASETS);

  isTotal = (value) => value === 'ALL';

  isForecast = (category) =>
    typeof category === 'string' &&
    category.indexOf(this.POPULATION_FORECAST_STRING) > -1;

  isByAge = (category) =>
    typeof category === 'string' &&
    category.indexOf(this.POPULATION_BY_AGE_STRING) > -1;

  getYearByAge = (category) =>
    this.isByAge(category)
      ? parseInt(
          category.slice(0, category.indexOf(this.POPULATION_BY_AGE_STRING))
        )
      : undefined;

  getYearForecast = (category) =>
    this.isForecast(category)
      ? parseInt(
          category.slice(0, category.indexOf(this.POPULATION_BY_AGE_STRING))
        )
      : undefined;
}

const dataVisualizationInstance = new DataVisualization();
export default dataVisualizationInstance;
