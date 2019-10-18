
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchService } from '../../redux/actions/services';
import ServiceView from './ServiceView';
import styles from './styles';

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

export default withStyles(styles)(connect(
  mapStateToProps,
  { fetchService },
)(ServiceView));
