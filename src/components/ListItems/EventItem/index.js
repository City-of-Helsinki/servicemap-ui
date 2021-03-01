
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import EventItem from './EventItem';
import { changeSelectedEvent } from '../../../redux/actions/event';

// Listen to redux state
const mapStateToProps = (state) => {
  const {
    navigator,
  } = state;
  return {
    navigator,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent },
)(EventItem));
