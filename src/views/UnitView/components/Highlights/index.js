import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import Highlights from './Highlights';
import styles from '../../styles/styles';

export default injectIntl(withStyles(styles)(Highlights));
