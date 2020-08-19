import React from 'react';
import PropTypes from 'prop-types';
import { EventAvailable } from '@material-ui/icons';
import SimpleListItem from '../SimpleListItem';

const ReservationItem = ({ getLocaleText, reservation, intl }) => (
  <SimpleListItem
    key={reservation.id}
    icon={<EventAvailable />}
    link
    text={`${getLocaleText(reservation.name)} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
    divider
    handleItemClick={() => {
      window.open(`https://varaamo.hel.fi/resources/${reservation.id}`);
    }}
  />
);

ReservationItem.propTypes = {
  getLocaleText: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  reservation: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default ReservationItem;
