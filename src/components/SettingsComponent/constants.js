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
};
