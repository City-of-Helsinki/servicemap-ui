import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default injectIntl(withRouter(connect(
  mapStateToProps,
)(DefaultLayout)));
