import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import SMButton from './ServiceMapButton';
import styles from './styles';

export default injectIntl(withStyles(styles)(SMButton));
