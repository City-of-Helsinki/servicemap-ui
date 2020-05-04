import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import DefaultLayout from './DefaultLayout';
import { toggleSettings } from '../redux/actions/settings';
import styles from './styles';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, settings, user } = state;
  const { toggled } = settings;
  return {
    currentPage: user.page,
    settingsToggled: toggled,
    navigator,
  };
};

export default injectIntl(withRouter(connect(
  mapStateToProps,
  { toggleSettings },
)(withStyles(styles)(DefaultLayout))));
