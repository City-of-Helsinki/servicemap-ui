import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import CloseButton from './CloseButton';
import styles from './styles';

export default injectIntl(withStyles(styles)(CloseButton));
