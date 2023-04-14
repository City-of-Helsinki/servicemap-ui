import {
  setMapType, setMobility, toggleCity, toggleColorblind, toggleHearingAid, toggleVisuallyImpaired,
} from '../../redux/actions/settings';

const senses = ['colorblind', 'hearingAid', 'visuallyImpaired'];

export default {
  senseSettingList: [
    { id: 'colorblind', title: 'settings.sense.colorblind' },
    { id: 'hearingAid', title: 'settings.sense.hearingAid' },
    { id: 'visuallyImpaired', title: 'settings.sense.visuallyImpaired' },
  ],
  mobilitySettingList: [
    { id: 'none', title: 'settings.mobility.none' },
    { id: 'wheelchair', title: 'settings.mobility.wheelchair' },
    { id: 'reduced_mobility', title: 'settings.mobility.reduced_mobility' },
    { id: 'rollator', title: 'settings.mobility.rollator' },
    { id: 'stroller', title: 'settings.mobility.stroller' },
  ],
  convertSettingsList: (list, intl) => list.map(
    ({ id, title }) => ({ id, title: intl.formatMessage({ id: title }) }),
  ),
  convertToSettingsValues: settings => ({
    mobility: settings.mobility,
    senses: Object.keys(settings)
      .filter(key => senses.includes(key) && settings[key] === true),
    cities: Object.keys(settings.cities)
      .filter(city => settings.cities[city] === true),
  }),
  // I am sorry. This was done to deduplicate code. Not pretty.
  handleOptionSelecting: (id, category, dispatch, cities, settingsValues) => {
    if (!id) {
      return;
    }
    if (category === 'mobility') {
      dispatch(setMobility(id));
    }
    if (category === 'cities') {
      const settingObj = cities;
      settingObj[id] = !settingObj[id];
      dispatch(toggleCity(settingObj));
    }

    if (category === 'senses') {
      if (id === 'hearingAid') {
        dispatch(toggleHearingAid());
      }
      // settingsValues.senses contains all previous sense settings. So now if it does not include
      // "id" then it was turned on just now.
      const settingTurnedOn = !settingsValues.senses.includes(id);
      if (id === 'colorblind') {
        dispatch(toggleColorblind());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('visuallyImpaired')) {
          dispatch(setMapType('servicemap'));
        }
      }
      if (id === 'visuallyImpaired') {
        dispatch(toggleVisuallyImpaired());
        if (settingTurnedOn) {
          dispatch(setMapType('accessible_map'));
        } else if (!settingsValues.senses.includes('colorblind')) {
          dispatch(setMapType('servicemap'));
        }
      }
    }
  },
};
