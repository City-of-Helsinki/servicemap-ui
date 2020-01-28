import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import EventDetailView from './EventDetailView';
import { changeSelectedEvent } from '../../redux/actions/event';
import { fetchSelectedUnit } from '../../redux/actions/selectedUnit';
import { getLocaleString } from '../../redux/selectors/locale';
import styles from './styles';

const mapStateToProps = (state) => {
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { event } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  const map = state.mapRef.leafletElement;
  const { navigator } = state;
  return {
    event,
    getLocaleText,
    navigator,
    map,
    selectedUnit,
  };
};

export default withStyles(styles)(withRouter(injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent, fetchSelectedUnit },
)(EventDetailView))));
