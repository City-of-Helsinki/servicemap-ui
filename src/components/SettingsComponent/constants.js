import SettingsUtility from '../../utils/settings';

export default {
  convertToSettingsValues: settings => ({
    mobility: settings.mobility,
    senses: SettingsUtility.accessibilityImpairmentKeys
      .filter(key => settings[key] === true),
    cities: settings.cities
      ? Object.keys(settings.cities)
        .filter(city => settings.cities[city] === true)
      : [],
    organizations: settings.organizations
      ? Object.keys(settings.organizations)
        .filter(organization => settings.organizations[organization] === true)
      : [],
  }),
};
