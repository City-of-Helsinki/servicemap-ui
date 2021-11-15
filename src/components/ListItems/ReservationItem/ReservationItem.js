import React from 'react';
import PropTypes from 'prop-types';
import { EventAvailable } from '@material-ui/icons';
import SimpleListItem from '../SimpleListItem';
import useLocaleText from '../../../utils/useLocaleText';

const ReservationItem = ({ reservation, intl, divider }) => {
  const getLocaleText = useLocaleText();
  return (
    <SimpleListItem
      key={reservation.id}
      icon={<EventAvailable color="primary" />}
      link
      text={`${getLocaleText(reservation.name)} ${intl.formatMessage({ id: 'unit.opens.new.tab' })}`}
      divider={divider}
      handleItemClick={() => {
        window.open(`https://varaamo.hel.fi/resources/${reservation.id}`);
      }}
    />
  );
};

ReservationItem.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  reservation: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
  divider: PropTypes.bool,
};

ReservationItem.defaultProps = {
  divider: true,
};

export default ReservationItem;
