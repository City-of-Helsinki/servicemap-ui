/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import UnitHelper from '../../../utils/unitHelper';
import ResultItem from '../ResultItem';
import SettingsUtility from '../../../utils/settings';
import UnitIcon from '../../SMIcon/UnitIcon';
import { uppercaseFirst } from '../../../utils';
import calculateDistance from '../../../utils/calculateDistance';

class UnitItem extends React.Component {
  state = {
    didMount: false,
  }

  componentDidMount() {
    // Set didMount on client side to avoid ssr-client difference errors
    this.setState({
      didMount: true,
    });
  }

  parseAccessibilityText() {
    const {
      unit, intl, settings,
    } = this.props;
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
  }

  render() {
    const {
      address,
      classes,
      currentPage,
      unit,
      changeSelectedUnit,
      onClick,
      getLocaleText,
      intl,
      single,
      navigator,
      userLocation,
    } = this.props;

    // Don't render if not valid unit
    if (!UnitHelper.isValidUnit(unit)) {
      return null;
    }
    const { didMount } = this.state;

    const icon = didMount ? <UnitIcon unit={unit} /> : null;

    // Parse unit data
    const {
      contract_type, id, name,
    } = unit;

    // Accessibility text and color
    const accessData = didMount ? this.parseAccessibilityText() : 0;
    const accessText = accessData.text;
    const { problemCount } = accessData;

    // Use address if possible or user location to figure out distance
    let latLng = null;
    try {
      const addCoords = address && address.addressCoordinates;
      latLng = addCoords && currentPage === 'address' ? { latitude: addCoords[1], longitude: addCoords[0] } : userLocation;
    } catch (e) {
      latLng = userLocation;
    }

    // Distance
    let distance = calculateDistance(unit, latLng);
    if (distance) {
      if (distance >= 1000) {
        distance /= 1000; // Convert from m to km
        distance = distance.toFixed(1); // Show only one decimal
        distance = intl.formatNumber(distance); // Format distance according to locale
        distance = { distance, type: 'km' };
      } else {
        distance = { distance, type: 'm' };
      }
    }

    // Contract type text
    const contractType = contract_type && contract_type.description ? uppercaseFirst(getLocaleText(contract_type.description)) : '';

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
        distance={distance}
        icon={icon}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) {
            onClick();
          } else if (navigator) {
            changeSelectedUnit(unit);
            navigator.push('unit', { id });
          }
        }}
        single={single}
      />
    );
  }
}

export default UnitItem;

// Typechecking
UnitItem.propTypes = {
  address: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  currentPage: PropTypes.string.isRequired,
  unit: PropTypes.objectOf(PropTypes.any),
  changeSelectedUnit: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
  single: PropTypes.bool,
};

UnitItem.defaultProps = {
  address: null,
  unit: {},
  onClick: null,
  navigator: null,
  userLocation: null,
  single: false,
};
