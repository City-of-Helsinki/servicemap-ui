import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import FeedbackView from './FeedbackView';
import { getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  const getLocaleText = textObject => getLocaleString(state, textObject);
  return {
    navigator,
    selectedUnit,
    getLocaleText,
  };
};

export default injectIntl(withRouter(withStyles(styles)(connect(
  mapStateToProps,
)(FeedbackView))));
