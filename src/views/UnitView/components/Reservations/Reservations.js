import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import TitledList from '../../../../components/Lists/TitledList';
import ReservationItem from '../../../../components/ListItems/ReservationItem';

const Reservations = ({
  listLength,
  reservationsData,
  navigator,
  unit,
}) => {
  const {
    data, isFetching, max,
  } = reservationsData;

  if (!data) {
    return null;
  }

  const location = useLocation();

  const endIndex = listLength > data.length ? data.length : listLength;
  const shownData = data.slice(0, endIndex);

  if (shownData && shownData.length) {
    return (
      <div>
        <TitledList
          title={<FormattedMessage id="unit.reservations" />}
          subtitle={<FormattedMessage id="unit.reservations.count" values={{ count: max || 0 }} />}
          titleComponent="h4"
          loading={isFetching}
          buttonID="UnitReservationButton"
          buttonMessageID="unit.reservations.more"
          onButtonClick={listLength
            ? () => {
              if (navigator) {
                navigator.replace({
                  ...location,
                  hash: 'UnitReservationButton',
                });
                navigator.push('unit', { id: unit.id, type: 'reservations' });
              }
            } : null}
        >
          {shownData.map(item => (
            <ReservationItem key={item.id} reservation={item} />
          ))}
        </TitledList>
      </div>
    );
  } return (null);
};

Reservations.propTypes = {
  reservationsData: PropTypes.objectOf(PropTypes.any).isRequired,
  listLength: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
  unit: PropTypes.objectOf(PropTypes.any),
};

Reservations.defaultProps = {
  unit: null,
  listLength: 5,
  navigator: null,
};

export default Reservations;
