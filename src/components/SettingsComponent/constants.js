const senses = ['colorblind', 'hearingAid', 'visuallyImpaired'];

export default {
  convertToSettingsValues: settings => ({
    mobility: settings.mobility,
    senses: Object.keys(settings)
      .filter(key => senses.includes(key) && settings[key] === true),
    cities: Object.keys(settings.cities)
      .filter(city => settings.cities[city] === true),
  }),
};
