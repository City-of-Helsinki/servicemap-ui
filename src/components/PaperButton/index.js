import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import PaperButton from './PaperButton';
import styles from './styles';

export default injectIntl(withStyles(styles)(PaperButton));
