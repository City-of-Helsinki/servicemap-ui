import { alphabeticCompare } from '../../../utils';
import SettingsUtility from '../../../utils/settings';

/**
 * Utility to parse url params in unit view. Also separated to this file because I'm in a hurry and
 * I'm not familiar how to test react hooks.
 * @param urlSearch
 * @returns array of settings to set [{setting, value},...]
 * ?mobility=&foo=bar will return [{setting: 'mobility', value: null}]
 * ?mobility=stroller&foo=bar will return [{setting: 'mobility', value: 'stroller'}]
 * ?senses=&foo=bar will return [{setting: 'senses', value: null}]
 * ?senses=hearingAid&foo=bar will return [{setting: 'senses', value: 'hearingAid'}]
 * ?foo=bar will return []
 */
export const parseUnitViewUrlParams = (urlSearch) => {
  const search = new URLSearchParams(urlSearch);
  const actions = [];

  // mobility
  const mobility = search.get('mobility');
  if (mobility) {
    const newSetting = SettingsUtility.isValidMobilitySetting(mobility)
      ? mobility
      : null;
    actions.push({ setting: 'mobility', value: newSetting });
  }
  if (mobility === '') {
    actions.push({ setting: 'mobility', value: null });
  }
  if (mobility === null || mobility === undefined) {
    // do nothing
  }

  // senses
  const senses = search.get('senses')?.split(',');
  if (senses) {
    const validSenses = senses.filter((s) =>
      SettingsUtility.isValidAccessibilitySenseImpairment(s)
    );
    actions.push(
      ...validSenses.map((sense) => ({ setting: 'senses', value: sense }))
    );
    if (validSenses.length === 0) {
      actions.push({ setting: 'senses', value: null });
    }
  }
  if (senses === null || senses === undefined) {
    // do nothing
  }

  const mapType = search.get('map');
  if (SettingsUtility.mapSettings.includes(mapType)) {
    actions.push({ setting: 'mapType', value: mapType });
  }

  // sort to make tests predictable
  actions.sort((a, b) => {
    const settingCompare = alphabeticCompare(a.setting, b.setting);
    if (settingCompare !== 0) {
      return settingCompare;
    }
    return alphabeticCompare(a.value, b.value);
  });
  return actions;
};
