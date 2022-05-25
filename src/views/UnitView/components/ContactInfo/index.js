import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import ContactInfo from './ContactInfo';
import styles from '../../styles/styles';

export default injectIntl(withStyles(styles)(ContactInfo));
