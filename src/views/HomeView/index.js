import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import HomeView from './HomeView';
import { toggleSettings } from '../../redux/actions/settings';
import styles from './styles';
import { getLocaleString } from '../../redux/selectors/locale';
import { getAddressNavigatorParamsConnector } from '../../utils/address';

// Listen to redux state
const mapStateToProps = (state) => {
  const { units, user, navigator } = state;
  const {
    data, isFetching, count, max,
  } = units;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const getAddressNavigatorParams = getAddressNavigatorParamsConnector(getLocaleText, user.locale);
  return {
    unit: state.unit,
    units: data,
    getAddressNavigatorParams,
    getLocaleText,
    isFetching,
    count,
    max,
    navigator,
    userLocation: user.position,
  };
};

export default connect(
  mapStateToProps,
  { toggleSettings },
)(withStyles(styles)(HomeView));
