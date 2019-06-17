import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { EventAvailable } from '@material-ui/icons';
import TitledList from '../../../components/Lists/TitledList';
import SimpleListItem from '../../../components/ListItems/SimpleListItem';

const Reservations = ({
  listLength, unitId, reservations, getLocaleText, navigator,
}) => {
  if (reservations && reservations.length > 0) {
    return (
      <TitledList
        title={<FormattedMessage id="unit.reservations" />}
        titleComponent="h4"
        listLength={listLength}
        buttonText={<FormattedMessage id="unit.moreReservations" values={{ count: reservations.length }} />}
        showMoreOnClick={listLength
          ? (e) => {
            e.preventDefault();
            if (navigator) {
              navigator.push('unitFullList', { id: unitId, type: 'reservations' });
            }
          } : null}
      >
        {reservations.map(item => (
          <SimpleListItem
            key={item.id}
            icon={<EventAvailable />}
            link
            text={getLocaleText(item.name)}
            divider
            handleItemClick={() => {
              window.open(`https://varaamo.hel.fi/resources/${item.id}`);
            }}
          />
        ))}
      </TitledList>
    );
  } return (null);
};

Reservations.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.any),
  getLocaleText: PropTypes.func.isRequired,
  listLength: PropTypes.number,
  unitId: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
};

Reservations.defaultProps = {
  reservations: [],
  listLength: null,
  navigator: null,
  unitId: null,
};

export default Reservations;
