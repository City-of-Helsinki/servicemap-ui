import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AreaTab from './AreaTab';
import styles from '../../styles';

export default injectIntl(withStyles(styles)(AreaTab));
