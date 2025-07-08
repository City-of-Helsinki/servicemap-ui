import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { changeSelectedEvent } from '../../../redux/actions/event';
import EventItem from './EventItem';

// Listen to redux state
const mapStateToProps = (state) => {
  const { navigator } = state;
  return {
    navigator,
  };
};

export default injectIntl(
  connect(mapStateToProps, { changeSelectedEvent })(EventItem)
);
