import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { fetchService } from '../../redux/actions/services';
import ServiceView from './ServiceView';

export default withRouter(connect(() => ({}), { fetchService })(ServiceView));
