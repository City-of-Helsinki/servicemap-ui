/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/css';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectNavigator } from '../../../redux/selectors/general';
import { selectSelectedAccessibilitySettings } from '../../../redux/selectors/settings';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../redux/selectors/unit';
import UnitHelper from '../../../utils/unitHelper';
import ResultItem from '../ResultItem';
import UnitIcon from '../../SMIcon/UnitIcon';
import isClient, { formatDistanceObject } from '../../../utils';
import useLocaleText from '../../../utils/useLocaleText';

const UnitItem = ({
  unit = {},
  onClick = null,
  divider = true,
  simpleItem = false,
}) => {
  const getLocaleText = useLocaleText();
  const intl = useIntl();
  const selectedShortcomings = useSelector(selectSelectedAccessibilitySettings);
  const navigator = useSelector(selectNavigator);
  const currentlyUsedPosition = useSelector(getCurrentlyUsedPosition);
  const distance = formatDistanceObject(intl, calculateDistance(unit, currentlyUsedPosition));

  const parseAccessibilityText = () => {
    let accessText = null;
    let accessibilityProblems = null;
    if (selectedShortcomings.length && unit) {
      accessibilityProblems = UnitHelper.getShortcomingCount(unit, selectedShortcomings);
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
  const { id, name } = unit;

  // Don't render if not valid unit
  if (!UnitHelper.isValidUnit(unit)) {
    return null;
  }

  // Accessibility text and color
  const accessData = isClient() ? parseAccessibilityText() : 0;
  const accessText = accessData.text;
  const { problemCount } = accessData;

  // Contract type text
  const contractText = UnitHelper.getContractText(unit, intl, getLocaleText) || '';

  const distanceText = distance ? {
    text: `${distance.distance} ${distance.type}`,
    srText: `${distance.distance} ${distance.type === 'm'
      ? intl.formatMessage({ id: 'general.distance.meters' })
      : intl.formatMessage({ id: 'general.distance.kilometers' })}`,
  } : {};

  const titleClass = css({
    fontWeight: 'bold',
  });

  if (!simpleItem) {
    return (
      <ResultItem
        data-sm="UnitItem"
        title={getLocaleText(name)}
        subtitle={contractText}
        bottomText={accessText}
        bottomHighlight={problemCount !== null && typeof problemCount !== 'undefined'}
        extendedClasses={{
          typography: {
            title: titleClass,
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
        unitId={id}
        divider={divider}
      />
    );
  }
  return (
    <ResultItem
      data-sm="UnitItem"
      title={getLocaleText(name)}
      simpleItem={simpleItem}
      extendedClasses={{
        typography: {
          title: titleClass,
        },
      }}
      distance={distanceText}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        } else {
          UnitHelper.unitElementClick(navigator, unit);
        }
      }}
      unitId={id}
      divider={divider}
    />
  );
};

export default UnitItem;

// Typechecking
UnitItem.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  onClick: PropTypes.func,
  divider: PropTypes.bool,
  simpleItem: PropTypes.bool,
};
