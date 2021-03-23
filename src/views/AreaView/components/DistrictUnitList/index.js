import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import DistrictUnitList from './DistrictUnitList';
import styles from '../../styles';

export default injectIntl(withStyles(styles)(DistrictUnitList));
