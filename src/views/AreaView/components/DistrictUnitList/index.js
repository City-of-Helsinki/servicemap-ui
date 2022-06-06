import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import DistrictUnitList from './DistrictUnitList';
import styles from '../../styles';

export default injectIntl(withStyles(styles)(DistrictUnitList));
