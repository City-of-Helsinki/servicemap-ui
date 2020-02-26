import React from 'react';

import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import TitledList from '../../../components/Lists/TitledList';
import ReservationItem from '../../../components/ListItems/ReservationItem';

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

  const endIndex = listLength > data.length ? data.length : listLength;
  const shownData = data.slice(0, endIndex);

  if (shownData && shownData.length) {
    return (
      <div>
        <TitledList
          title={<FormattedMessage id="unit.reservations" />}
          subtitle={<FormattedMessage id="unit.reservations.count" values={{ count: max }} />}
          titleComponent="h4"
          shortened={max > listLength}
          loading={isFetching}
          buttonMessageID="unit.reservations.more"
          showMoreOnClick={listLength
            ? () => {
              if (navigator) {
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

const mapStateToProps = (state) => {
  const { navigator, selectedUnit } = state;
  const unit = selectedUnit.unit.data;
  return {
    unit,
    navigator,
  };
};

export default connect(
  mapStateToProps,
  null,
)(Reservations);
