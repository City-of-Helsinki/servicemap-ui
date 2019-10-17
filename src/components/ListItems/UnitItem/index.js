
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import UnitItem from './UnitItem';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator, settings, user } = state;
  return {
    getLocaleText,
    navigator,
    settings,
    userLocation: user.position,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem));
