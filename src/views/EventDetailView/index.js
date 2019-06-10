import { connect } from 'react-redux';
import EventDetailView from './EventDetailView';
import { getLocaleString } from '../../redux/selectors/locale';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { navigator } = state;
  return {
    getLocaleText,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  null,
)(EventDetailView);
