import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import styles from './styles';
import SuggestionBox from './SuggestionBox';

// Listen to redux state
const mapStateToProps = state => ({
  locale: state.user.locale,
  navigator: state.navigator,
});

export default withStyles(styles)(injectIntl(connect(mapStateToProps)(SuggestionBox)));
