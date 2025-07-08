import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FeedbackView from './FeedbackView';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  return {
    navigator,
    selectedUnit,
  };
};

export default injectIntl(withRouter(connect(mapStateToProps)(FeedbackView)));
