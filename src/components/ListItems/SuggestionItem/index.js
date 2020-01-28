import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import SuggestionItem from './SuggestionItem';
import styles from './styles';

export default injectIntl(withStyles(styles)(SuggestionItem));
