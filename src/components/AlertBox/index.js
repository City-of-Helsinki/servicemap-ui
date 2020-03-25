import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AlertBox from './AlertBox';
import styles from './styles';

export default withStyles(styles)(injectIntl(AlertBox));
