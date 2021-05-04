import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import MenuButton from './MenuButton';
import styles from '../styles';

export default injectIntl(withStyles(styles)(MenuButton));
