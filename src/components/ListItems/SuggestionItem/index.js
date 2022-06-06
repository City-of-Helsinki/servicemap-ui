import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import SuggestionItem from './SuggestionItem';
import styles from './styles';

export default injectIntl(withStyles(styles)(SuggestionItem));
