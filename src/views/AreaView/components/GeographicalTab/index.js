import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import GeographicalTab from './GeographicalTab';
import styles from '../../styles';

export default injectIntl(withStyles(styles)(GeographicalTab));
