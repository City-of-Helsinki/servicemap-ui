import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import CloseButton from './CloseButton';
import styles from './styles';

export default injectIntl(withStyles(styles)(CloseButton));
