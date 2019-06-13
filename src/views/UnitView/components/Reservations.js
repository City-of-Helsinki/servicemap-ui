import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import InfoList from './InfoList';

const Reservations = ({ reservations }) => {
  const data = [];

  const res = reservations
    ? reservations.map(res => ({ type: 'RESERVATION', value: { name: res.name, www: `https://varaamo.hel.fi/resources/${res.id}` } }))
    : null;

  if (res) {
    data.push(...res);
  }

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.reservations" />}
      titleComponent="h4"
    />
  );
};

Reservations.propTypes = {
  reservations: PropTypes.arrayOf(PropTypes.any),
};

Reservations.defaultProps = {
  reservations: [],
};

export default Reservations;
