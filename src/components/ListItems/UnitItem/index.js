import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import UnitItem from './UnitItem';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import { calculateDistance, getCurrentlyUsedPosition } from '../../../redux/selectors/unit';
import { formatDistanceObject } from '../../../utils';

// Listen to redux state
const mapStateToProps = (state, props) => {
  const {
    intl, unit,
  } = props;
  const {
    navigator, settings,
  } = state;
  return {
    distance: formatDistanceObject(intl, calculateDistance(unit, getCurrentlyUsedPosition(state))),
    navigator,
    settings,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem));
