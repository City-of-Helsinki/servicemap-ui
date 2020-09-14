
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { getLocaleString } from '../../redux/selectors/locale';
import { fetchService } from '../../redux/actions/services';
import ServiceView from './ServiceView';
import { getServiceUnits } from '../../redux/selectors/service';
import { changeCustomUserLocation } from '../../redux/actions/user';
import styles from './styles';

const mapStateToProps = (state) => {
  const { mapRef, service, user } = state;
  const { customPosition } = user;

  const getLocaleText = textObject => getLocaleString(state, textObject);
  const map = mapRef && mapRef.leafletElement;
  const units = getServiceUnits(state);

  return {
    customPosition: customPosition.coordinates,
    getLocaleText,
    map,
    unitData: units,
    serviceReducer: service,
  };
};

export default withRouter(withStyles(styles)(connect(
  mapStateToProps,
  { changeCustomUserLocation, fetchService },
)(ServiceView)));
