import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actionSetInitialLoad } from '../../../../redux/actions/user';
import { selectInitialLoad } from '../../../../redux/selectors/user';
import ViewTitle from './ViewTitle';

// State mapping to props
const mapStateToProps = (state) => ({
  initialLoad: selectInitialLoad(state),
});

export default withRouter(
  connect(mapStateToProps, { actionSetInitialLoad })(ViewTitle)
);
