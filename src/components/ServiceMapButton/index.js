import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SMButton from './ServiceMapButton';
import styles from './styles';

export default injectIntl(withStyles(styles)(SMButton));
