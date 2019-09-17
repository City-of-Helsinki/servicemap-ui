/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import UnitHelper from '../../../utils/unitHelper';
import ResultItem from '../ResultItem';
import SettingsUtility from '../../../utils/settings';
import UnitIcon from '../../SMIcon/UnitIcon';
import { uppercaseFirst } from '../../../utils';

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
    let markerColor = null;
    if (accessSettingsSet && unit && settings) {
      const accessibilityProblems = UnitHelper.getShortcomingCount(unit, settings);
      markerColor = UnitHelper.getIconColor(accessibilityProblems);
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
    return { text: accessText, color: markerColor };
  }

  render() {
    const {
      unit, changeSelectedUnit, onClick, getLocaleText, navigator,
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
    const accessData = this.parseAccessibilityText();
    const accessText = accessData.text;
    const accessColor = accessData.color;

    // Distance text
    // TODO: Change to check data for distance once location info is available
    const distance = null; // '100';

    // Contract type text
    const contractType = contract_type && contract_type.description ? uppercaseFirst(getLocaleText(contract_type.description)) : '';

    return (
      <ResultItem
        title={getLocaleText(name)}
        subtitle={contractType}
        bottomRightText={accessText}
        bottomRightColor={accessColor}
        distancePosition={distance}
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
      />
    );
  }
}

export default UnitItem;

// Typechecking
UnitItem.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any),
  changeSelectedUnit: PropTypes.func.isRequired,
  getLocaleText: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  intl: intlShape.isRequired,
  navigator: PropTypes.objectOf(PropTypes.any),
  settings: PropTypes.objectOf(PropTypes.any).isRequired,
};

UnitItem.defaultProps = {
  unit: {},
  onClick: null,
  navigator: null,
};
