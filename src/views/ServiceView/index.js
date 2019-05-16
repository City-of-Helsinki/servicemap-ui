
import { connect } from 'react-redux';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchService } from '../../redux/actions/services';
import { setCurrentPage } from '../../redux/actions/user';
import ServiceView from './ServiceView';

const mapStateToProps = (state) => {
  const {
    count, current, errorMessage, isFetching, max, units,
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
    unitData: units,
  };
};

export default connect(
  mapStateToProps,
  { fetchService, setCurrentPage },
)(ServiceView);
