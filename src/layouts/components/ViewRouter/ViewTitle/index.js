
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { actionSetInitialLoad } from '../../../../redux/actions/user';
import ViewTitle from './ViewTitle';

// State mapping to props
const mapStateToProps = (state) => {
  const { user } = state;
  return {
    initialLoad: user.initialLoad,
  };
};

export default withRouter(connect(
  mapStateToProps,
  { actionSetInitialLoad },
)(ViewTitle));
