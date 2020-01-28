
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchService } from '../../redux/actions/services';
import ServiceView from './ServiceView';
import { getServiceUnits } from '../../redux/selectors/service';
import styles from './styles';

const mapStateToProps = (state) => {
  const {
    count, current, errorMessage, isFetching, max,
  } = state.service;

  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = state.mapRef.leafletElement;
  const units = getServiceUnits(state);

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

export default withStyles(styles)(connect(
  mapStateToProps,
  { fetchService },
)(ServiceView));
