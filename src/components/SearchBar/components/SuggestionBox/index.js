import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from './styles';
import SuggestionBox from './SuggestionBox';

export default withStyles(styles)(injectIntl(SuggestionBox));
