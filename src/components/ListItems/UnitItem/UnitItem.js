/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import UnitHelper from '../../../utils/unitHelper';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import ResultItem from '../ResultItem';
import SettingsUtility from '../../../utils/settings';

class UnitItem extends React.Component {
  state = {
    icon: <img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />,
  };

  componentDidMount() {
    const { unit, settings } = this.props;
    this.setState({ icon: <img alt="" src={UnitHelper.getIcon(unit, settings, true)} style={{ height: 24 }} aria-hidden="true" /> });
  }

  parseAccessibilityText() {
    const {
      unit, intl, settings,
    } = this.props;
    const accessSettingsSet = SettingsUtility.hasActiveAccessibilitySettings(settings);
    let accessText = null;
    let markerColor = null;
    if (accessSettingsSet) {
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
      unit, changeSelectedUnit, onClick, getLocaleText, intl, navigator,
    } = this.props;
    // Don't render if not valid unit
    if (!UnitHelper.isValidUnit(unit)) {
      return null;
    }

    // Get icon
    const { icon } = this.state;

    // Parse unit data
    const {
      id, name, object_type,
    } = unit;

    // Accessibility text and color
    const accessData = this.parseAccessibilityText();
    const accessText = accessData.text;
    const accessColor = accessData.color;

    // Distance text
    // TODO: Change to check data for distance once location info is available
    const distance = null; // '100';

    return (
      <ResultItem
        title={getLocaleText(name)}
        subtitle={intl.formatMessage({ id: object_type })}
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

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator, settings } = state;
  return {
    getLocaleText,
    navigator,
    settings,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem));

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
