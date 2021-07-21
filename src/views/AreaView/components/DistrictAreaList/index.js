import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from '../../styles';
import { DistrictAreaList } from './DistrictAreaList';

export default injectIntl(withStyles(styles)(DistrictAreaList));
