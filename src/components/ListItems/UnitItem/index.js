
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import UnitItem from './UnitItem';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedUnit } from '../../../redux/actions/selectedUnit';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const {
    address, navigator, settings, user,
  } = state;
  return {
    address,
    currentPage: user.page,
    getLocaleText,
    navigator,
    settings,
    userLocation: user.position.coordinates,
  };
};

export default injectIntl(withStyles(styles)(connect(
  mapStateToProps,
  { changeSelectedUnit },
)(UnitItem)));
