
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import EventItem from './EventItem';
import { getLocaleString } from '../../../redux/selectors/locale';
import { changeSelectedEvent } from '../../../redux/actions/event';

// Listen to redux state
const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const {
    navigator,
  } = state;
  return {
    getLocaleText,
    navigator,
  };
};

export default injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent },
)(EventItem));
