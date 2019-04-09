import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import HomeButton from './HomeButton';

export default injectIntl(withRouter(HomeButton));
