/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { isValidUnit } from '../../../utils/unitHelper';
import { drawIcon } from '../../../views/Map/utils/drawIcon';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import ResultItem from '../ResultItem';

class UnitItem extends React.Component {
  state = {
    icon: <img alt="" src={null} style={{ height: 24 }} aria-hidden="true" />,
  };

  componentDidMount() {
    const { unit } = this.props;
    this.setState({ icon: <img alt="" src={drawIcon(unit, null, true)} style={{ height: 24 }} aria-hidden="true" /> });
  }

  render() {
    const {
      unit, changeSelectedUnit, onClick, getLocaleText, intl, navigator,
    } = this.props;
    // Don't render if not valid unit
    if (!isValidUnit(unit)) {
      return null;
    }

    // Get icon
    const { icon } = this.state;

    // Parse unit data
    const {
      id, name, object_type,
    } = unit;

    // Accessibility text
    // TODO: Change to check data once accessibility messages functionality has been added
    // TODO: Change texts to use translations once data is accessible
    const accessibilityProblems = null;
    let accessText = intl.formatMessage({ id: 'unit.accessibility.noInfo' });
    if (accessibilityProblems !== null && typeof accessibilityProblems !== 'undefined') {
      switch (accessibilityProblems) {
        case 0:
          accessText = intl.formatMessage({ id: 'unit.accessibility.ok' });
          break;
        default:
          accessText = intl.formatMessage({ id: 'unit.accessibility.problems' }, { count: accessibilityProblems });
      }
    }

    // Distance text
    // TODO: Change to check data for distance once location info is available
    const distance = null; // '100';

    return (
      <ResultItem
        title={getLocaleText(name)}
        subtitle={intl.formatMessage({ id: object_type })}
        botRightText={accessText}
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
  const { navigator } = state;
  return {
    getLocaleText,
    navigator,
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
};

UnitItem.defaultProps = {
  unit: {},
  onClick: null,
  navigator: null,
};
