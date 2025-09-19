import { connect } from 'react-redux';

import { fetchService } from '../../redux/actions/services';
import ServiceView from './ServiceView';

export default connect(() => ({}), { fetchService })(ServiceView);
