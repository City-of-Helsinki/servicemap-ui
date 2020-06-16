import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import TabLists from './TabLists';
import styles from './styles';
import { changeCustomUserLocation } from '../../redux/actions/user';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  const { position } = state.user;
  return {
    navigator,
    userAddress: position.addressData,
  };
};

export default connect(
  mapStateToProps,
  { changeCustomUserLocation },
)(injectIntl(withRouter(withStyles(styles)(TabLists))));
