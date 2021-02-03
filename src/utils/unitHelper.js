/* eslint-disable camelcase */
import { drawUnitIcon } from '../views/MapView/utils/drawIcon';
import isClient, { uppercaseFirst } from '.';
import SettingsUtility from './settings';
import config from '../../config';
import { isEmbed } from './path';
import paths from '../../config/paths';

// TODO: If berries are not used anymore, clean this class

const { accessibilityColors } = config;

const generateMarkerIcons = () => {
  if (!isClient()) {
    return null;
  }
  const markers = {};
  Object.keys(accessibilityColors).forEach((key) => {
    const color = accessibilityColors[key];
    if (color) {
      const iconLeft = drawUnitIcon(color, 70);
      const iconLeft2 = drawUnitIcon(color, 80);
      const iconMiddle = drawUnitIcon(color, 90);
      const iconRight = drawUnitIcon(color, 100);
      const iconRight2 = drawUnitIcon(color, 110);

      markers[key] = [iconLeft, iconLeft2, iconMiddle, iconRight, iconRight2];
    }
  });
  return markers;
};

class UnitHelper {
  static accessibilityColors = accessibilityColors;

  static markerIcons = generateMarkerIcons();

  static isValidUnit = unit => unit && unit.object_type === 'unit';

  static isUnitPage = () => paths.unit.regex.test(window.location.href);

  static getShortcomingCount(unit, settings) {
    if (unit && settings) {
      // Check if user has settings
      const currentSettings = SettingsUtility.parseShortcomingSettings(settings);
      if (currentSettings.length) {
        // eslint-disable-next-line camelcase
        const shortcomings = unit.accessibility_shortcoming_count;
        // Check if unit has shortcoming info
        if (shortcomings) {
          const shortcomingKeys = Object.keys(shortcomings);
          if (shortcomingKeys.length) {
            let shortcomingCount = 0;

            if (currentSettings.length) {
              // Loop through currentSetting keys and see if unit has shortcomings
              currentSettings.forEach((settingKey) => {
                if (
                  Object.prototype.hasOwnProperty.call(
                    shortcomings,
                    settingKey,
                  )
                ) {
                  shortcomingCount += shortcomings[settingKey];
                }
              });

              return shortcomingCount;
            }
          }
        }
        return null;
      }
    }
    return 0;
  }

  // Currently only default markers are used
  static getMarkerType = () => 'default';
  /*
  static getMarkerType = (count) => {
    if (typeof count === 'number') {
      if (count > 0) {
        return 'shortcomings';
      }
      return 'default';
    }
    return 'missingInfo';
  }
  */

  static getIconColor = count => (
    UnitHelper.accessibilityColors[UnitHelper.getMarkerType(count)]
  )

  static getDefaultIcon = () => {
    if (!UnitHelper.markerIcons) {
      return null;
    }
    const iconIndex = 2;

    const icon = UnitHelper.markerIcons.default[iconIndex];

    return icon;
  }

  static getIcon = (unit, settings, isStraight = false) => {
    if (!UnitHelper.markerIcons) {
      return null;
    }
    if (!unit || !settings) {
      const icon = UnitHelper.markerIcons.default[2];
      return icon;
    }
    const shortcomingCount = UnitHelper.getShortcomingCount(unit, settings);
    const markerType = UnitHelper.getMarkerType(shortcomingCount);

    let iconIndex = 2;
    if (!isStraight && unit.id) {
      const index = (unit.id % 5);
      iconIndex = index;
    }

    const icon = UnitHelper.markerIcons[markerType][iconIndex];

    return icon;
  }

  static unitElementClick = (navigator, unit) => {
    if (!global.window) {
      throw Error('Can\'t run unitElementClick without window');
    }
    if (!navigator || !navigator.push || !navigator.replace) {
      throw Error('Invalid navigator argument given.');
    }
    if (!unit || (typeof unit !== 'number' && !unit.id)) {
      throw Error('Invalid unit argument given.');
    }
    const id = typeof unit === 'number' ? unit : unit.id;
    const embeded = isEmbed();
    if (embeded) {
      const { origin } = window.location;
      const path = navigator.generatePath('unit', { id });
      window.open(`${origin}${path}`);
      return;
    }
    const action = paths.unit.regex.test(window.location.href)
      ? 'replace' : 'push';
    navigator[action]('unit', { id });
  }

  static getContractText = (unit, intl, getLocaleText) => {
    const { contract_type, department } = unit;
    if (!contract_type?.description) return null;

    const municipalIDs = ['municipal_service', 'purchased_service'];
    const contractText = uppercaseFirst(getLocaleText(contract_type.description));
    const contractMunicipality = department?.municipality;

    if (contractMunicipality && municipalIDs.includes(contract_type.id)) {
      const cityString = intl.formatMessage({
        id: `settings.city.${contractMunicipality}`,
        defaultMessage: ' ',
      });
      if (cityString.length > 1) {
        return `${contractText}, ${cityString}`;
      }
      return contractText;
    }
    return contractText;
  }
}

export default UnitHelper;
