import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from '../../styles';
import { DistrictAreaList } from './DistrictAreaList';

export default injectIntl(withStyles(styles)(DistrictAreaList));
