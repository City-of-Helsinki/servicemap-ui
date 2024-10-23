import React from 'react';
import PropTypes from 'prop-types';
import { EventAvailable } from '@mui/icons-material';
import SimpleListItem from '../SimpleListItem';
import config from '../../../../config';
import { useSelector } from 'react-redux';
import { getLocale } from '../../../redux/selectors/user';

const getLocalizedText = (reservation, locale) => {
  switch (locale) {
    case 'fi':
      return reservation.name_fi;
    case 'en':
      return reservation.name_en;
    case 'sv':
      return reservation.name_sv;
    default:
      return reservation.name_fi; // Fallback to Finnish
  }
};


const ReservationItem = ({
  reservation,
  intl,
  divider = true
}) => {
  const locale = useSelector(getLocale);
  const localizedText = getLocalizedText(reservation, locale);

  return (
    <SimpleListItem
      key={reservation.pk}
      className="reservationItem"
      icon={<EventAvailable color="primary" />}
      link
      text={`${localizedText} ${intl.formatMessage({ id: 'opens.new.tab' })}`}
      divider={divider}
      handleItemClick={() => {
        window.open(`${config.reservationsAPI.root}/${locale}/reservation-unit/${reservation.pk}`);
      }}
    />
  );
};

ReservationItem.propTypes = {
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  reservation: PropTypes.shape({
    pk: PropTypes.number,
    name_fi: PropTypes.string,
    name_en: PropTypes.string,
    name_sv: PropTypes.string,
  }).isRequired,
  divider: PropTypes.bool,
};

export default ReservationItem;
