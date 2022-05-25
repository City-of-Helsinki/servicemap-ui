import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import AddressSearchBar from './AddressSearchBar';
import styles from './styles';


export default withStyles(styles)(injectIntl(AddressSearchBar));
