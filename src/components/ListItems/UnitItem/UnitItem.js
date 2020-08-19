/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import UnitHelper from '../../../utils/unitHelper';
import ResultItem from '../ResultItem';
import SettingsUtility from '../../../utils/settings';
import UnitIcon from '../../SMIcon/UnitIcon';
import isClient, { uppercaseFirst } from '../../../utils';

const UnitItem = ({
  classes,
  distance,
  unit,
  onClick,
  getLocaleText,
  intl,
  padded,
  navigator,
  settings,
}) => {
  const parseAccessibilityText = () => {
    const accessSettingsSet = SettingsUtility.hasActiveAccessibilitySettings(settings);
    let accessText = null;
    let accessibilityProblems = null;
    if (accessSettingsSet && unit && settings) {
      accessibilityProblems = UnitHelper.getShortcomingCount(unit, settings);
      accessText = intl.formatMessage({ id: 'unit.accessibility.noInfo' });
      if (accessibilityProblems !== null && typeof accessibilityProblems !== 'undefined') {
        switch (accessibilityProblems) {
          case 0:
            accessText = intl.formatMessage({ id: 'unit.accessibility.ok' });
            break;
          default:
            accessText = intl.formatMessage({ id: 'unit.accessibility.problems' }, { count: accessibilityProblems });
        }
      }
    }
    return { text: accessText, problemCount: accessibilityProblems };
  };

  // Don't render if not valid unit
  if (!UnitHelper.isValidUnit(unit)) {
    return null;
  }

  const icon = isClient() ? <UnitIcon unit={unit} /> : null;

  // Parse unit data
  const {
    contract_type, id, name,
  } = unit;

  // Accessibility text and color
  const accessData = isClient() ? parseAccessibilityText() : 0;
  const accessText = accessData.text;
  const { problemCount } = accessData;

  // Contract type text
  const contractType = contract_type && contract_type.description ? uppercaseFirst(getLocaleText(contract_type.description)) : '';
  const distanceText = distance ? {
    text: `${distance.distance} ${distance.type}`,
    srText: `${distance.distance} ${distance.type === 'm'
      ? intl.formatMessage({ id: 'general.distance.meters' })
      : intl.formatMessage({ id: 'general.distance.kilometers' })}`,
  } : {};

  return (
    <ResultItem
      title={getLocaleText(name)}
      subtitle={contractType}
      bottomText={accessText}
      bottomHighlight={problemCount !== null && typeof problemCount !== 'undefined'}
      extendedClasses={{
        typography: {
          title: classes.title,
        },
      }}
      distance={distanceText}
      icon={icon}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        } else if (navigator) {
          navigator.push('unit', { id });
        }
      }}
      padded={padded}
    />
  );
};

export default UnitItem;

// Typechecking
UnitItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  distance: PropTypes.shape({
    distance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    type: PropTypes.oneOf(['m', 'km']),
    text: PropTypes.string,
  }),
  unit: PropTypes.objectOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  padded: PropTypes.bool,
};

UnitItem.defaultProps = {
  distance: null,
  unit: {},
  onClick: null,
  navigator: null,
  padded: false,
};
