import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import AddressSearchBar from './AddressSearchBar';
import styles from '../../styles';

export default injectIntl(withStyles(styles)(AddressSearchBar));
