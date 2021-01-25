import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import Highlights from './Highlights';
import styles from '../../styles/styles';

export default injectIntl(withStyles(styles)(Highlights));
