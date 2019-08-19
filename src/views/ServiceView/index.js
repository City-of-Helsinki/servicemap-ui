
import { connect } from 'react-redux';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchService } from '../../redux/actions/services';
import ServiceView from './ServiceView';

const mapStateToProps = (state) => {
  const {
    count, current, errorMessage, isFetching, max, data,
  } = state.service;

  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;

  return {
    count,
    current,
    error: errorMessage,
    getLocaleText,
    isLoading: isFetching,
    map,
    max,
    unitData: data,
  };
};

export default connect(
  mapStateToProps,
  { fetchService },
)(ServiceView);
