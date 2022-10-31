import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@mui/styles';
import { withRouter } from 'react-router-dom';
import TabLists from './TabLists';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  const { customPosition, position } = state.user;
  return {
    navigator,
    userAddress: position.addressData || customPosition.addressData,
  };
};

export default connect(
  mapStateToProps,
)(injectIntl(withRouter(withStyles(styles)(TabLists))));
