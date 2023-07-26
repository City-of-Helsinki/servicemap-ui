import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import DefaultLayout from './DefaultLayout';
import styles from './styles';
import { fetchErrors, fetchNews } from '../redux/actions/alerts';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator, user } = state;
  return {
    currentPage: user.page,
    navigator,
  };
};

export default injectIntl(withRouter(connect(
  mapStateToProps,
  { fetchErrors, fetchNews },
)(withStyles(styles)(DefaultLayout))));
