import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import MenuButton from './MenuButton';
import styles from '../styles';

export default injectIntl(withStyles(styles)(MenuButton));
