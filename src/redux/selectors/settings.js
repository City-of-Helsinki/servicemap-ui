import config from '../../../config';

export const getCitySettings = state => state.settings.cities;

export const getSelectedCities = (state) => {
  const citySettings = state.settings.cities;
  if (!citySettings) return [];
  return Object.keys(citySettings).filter(
    city => citySettings[city] && !config.wellbeingAreas.includes(city),
  );
};
