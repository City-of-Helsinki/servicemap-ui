import { connect } from 'react-redux';

import { fetchErrors, fetchNews } from '../redux/actions/alerts';
import DefaultLayout from './DefaultLayout';

export default connect(() => ({}), { fetchErrors, fetchNews })(DefaultLayout);
