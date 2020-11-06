/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import UnitHelper from '../../../utils/unitHelper';
import ResultItem from '../ResultItem';
import SettingsUtility from '../../../utils/settings';
import UnitIcon from '../../SMIcon/UnitIcon';
import isClient, { uppercaseFirst } from '../../../utils';
import locationIcon from '../../../assets/icons/LocationDefault.svg';
import locationIconHover from '../../../assets/icons/LocationHover.svg';
import locationIconContrast from '../../../assets/icons/LocationDefaultContrast.svg';
import locationIconContrastHover from '../../../assets/icons/LocationHoverContrast.svg';

const UnitItem = ({
  classes,
  distance,
  unit,
  onClick,
  getLocaleText,
  intl,
  padded,
  divider,
  navigator,
  settings,
  theme,
}) => {
  // Don't render if not valid unit
  if (!UnitHelper.isValidUnit(unit)) {
    return null;
  }

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

  const icon = isClient() ? <UnitIcon unit={unit} /> : null;
  // Parse unit data
  const {
    contract_type, id, name,
  } = unit;

  const resetMarkerHighlight = () => {
    // Handle marker highlight removal
    const marker = document.querySelector(`.unit-marker-${id}`);
    if (!marker) {
      return;
    }
    marker.classList.remove('markerHighlighted');
    if (marker.nodeName === 'IMG') {
      const icon = theme === 'dark' ? locationIconContrast : locationIcon;
      marker.setAttribute('src', icon);
    }
  };

  useEffect(() => () => {
    // Remove highlights on unmount
    resetMarkerHighlight();
  }, []);

  const onMouseEnter = () => {
    // Handle marker highlighting
    const marker = document.querySelector(`.unit-marker-${id}`);
    if (marker) {
      marker.classList.add('markerHighlighted');
      if (marker.nodeName === 'IMG') {
        const icon = theme === 'dark' ? locationIconContrastHover : locationIconHover;
        marker.setAttribute('src', icon);
      }
    }
  };

  const onMouseLeave = () => {
    // Reset marker highlighting
    resetMarkerHighlight();
  };

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
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      padded={padded}
      divider={divider}
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
  divider: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'default']).isRequired,
};

UnitItem.defaultProps = {
  distance: null,
  unit: {},
  onClick: null,
  navigator: null,
  padded: false,
  divider: false,
};
