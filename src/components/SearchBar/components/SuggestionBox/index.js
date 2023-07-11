import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import SuggestionBox from './SuggestionBox';

// Listen to redux state
const mapStateToProps = state => ({
  locale: state.user.locale,
  navigator: state.navigator,
});

export default injectIntl(connect(mapStateToProps)(SuggestionBox));
