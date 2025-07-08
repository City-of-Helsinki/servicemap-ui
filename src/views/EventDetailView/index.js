import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeSelectedEvent } from '../../redux/actions/event';
import { fetchSelectedUnit } from '../../redux/actions/selectedUnit';
import EventDetailView from './EventDetailView';

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

export default withRouter(
  injectIntl(
    connect(mapStateToProps, { changeSelectedEvent, fetchSelectedUnit })(
      EventDetailView
    )
  )
);
