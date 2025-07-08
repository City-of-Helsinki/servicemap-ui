import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InfoView from './InfoView';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  const { locale } = state.user;
  return {
    navigator,
    locale,
  };
};

export default withRouter(connect(mapStateToProps)(InfoView));
