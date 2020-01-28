import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import styles from './styles';
import SuggestionBox from './SuggestionBox';
import { getLocaleString } from '../../../../redux/selectors/locale';

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    getLocaleText,
    locale: state.user.locale,
  };
};

export default withStyles(styles)(injectIntl(connect(mapStateToProps)(SuggestionBox)));
