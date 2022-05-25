import { withStyles } from '@mui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import styles from './styles';
import ExpandedSuggestions from './ExpandedSuggestions';


// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator, user,
  } = state;

  return {
    locale: user.locale,
    navigator,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(injectIntl(ExpandedSuggestions))),
);
