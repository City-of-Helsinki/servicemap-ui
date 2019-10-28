import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import ResultItem from './ResultItem';
import styles from './styles';

export default injectIntl(withStyles(styles)(ResultItem));
