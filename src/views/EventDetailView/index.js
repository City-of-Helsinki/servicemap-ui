import { connect } from 'react-redux';
import { withStyles } from '@mui/styles';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import EventDetailView from './EventDetailView';
import { changeSelectedEvent } from '../../redux/actions/event';
import { fetchSelectedUnit } from '../../redux/actions/selectedUnit';
import styles from './styles';

const mapStateToProps = (state) => {
  const { event, mapRef, navigator } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  const map = mapRef;
  return {
    event,
    navigator,
    map,
    selectedUnit,
  };
};

export default withStyles(styles)(withRouter(injectIntl(connect(
  mapStateToProps,
  { changeSelectedEvent, fetchSelectedUnit },
)(EventDetailView))));
