import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FeedbackView from './FeedbackView';

const mapStateToProps = (state) => {
  const { navigator } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  return {
    navigator,
    selectedUnit,
  };
};

export default injectIntl(connect(mapStateToProps)(FeedbackView));
