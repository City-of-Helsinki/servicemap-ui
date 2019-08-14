import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import PaginationComponent from './PaginationComponent';
import styles from './styles';

export default withStyles(styles)(injectIntl(PaginationComponent));
