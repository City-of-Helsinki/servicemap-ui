import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import TabLists from './TabLists';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default connect(mapStateToProps)(injectIntl(withRouter(withStyles(styles)(TabLists))));
