import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from './styles';
import ExpandedSuggestions from './ExpandedSuggestions';

export default withStyles(styles)(injectIntl(ExpandedSuggestions));
