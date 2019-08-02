
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import UnitItem from './UnitItem';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';

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
