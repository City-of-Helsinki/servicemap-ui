import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import UnitTab from './UnitTab';
import styles from '../../styles';

export default injectIntl(withStyles(styles)(UnitTab));
