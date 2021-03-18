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
  // TODO: replace this with useLocaleText when the component is converted to function component
  const getLocaleText = textObject => getLocaleString(state, textObject);
  const { event, mapRef, navigator } = state;
  const selectedUnit = state.selectedUnit.unit.data;
  const map = mapRef && mapRef.leafletElement;
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
