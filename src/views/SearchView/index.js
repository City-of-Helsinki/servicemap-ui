import { withStyles } from '@material-ui/styles';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import SearchView from './SearchView';
import styles from './styles';

export default withStyles(styles)(withRouter(injectIntl(SearchView)));
