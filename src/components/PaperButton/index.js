import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import PaperButton from './PaperButton';
import styles from './styles';

export default injectIntl(withStyles(styles)(PaperButton));
