import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import styles from './styles';
import ExpandedSuggestions from './ExpandedSuggestions';


// Listen to redux state
// const unitList = getUnitList(state);
const mapStateToProps = (state) => {
  const {
    navigator,
  } = state;

  return {
    navigator,
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(injectIntl(ExpandedSuggestions))),
);
