import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';
import { toggleSettings } from '../redux/actions/settings';

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
)(DefaultLayout)));
