import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import { injectIntl } from 'react-intl';
import FeedbackView from './FeedbackView';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  return {
    navigator,
    selectedUnit,
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
)(FeedbackView))));
