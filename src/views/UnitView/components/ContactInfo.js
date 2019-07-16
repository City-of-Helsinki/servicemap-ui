import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const ContactInfo = ({ unit }) => {
  const address = unit.street_address && { type: 'ADDRESS', value: unit.street_address };
  const hours = unitSectionFilter(unit.connections, 'OPENING_HOURS');
  const phone = unit.phone && { type: 'PHONE', value: { phone: unit.phone } };
  const contact = unitSectionFilter(unit.connections, 'PHONE_OR_EMAIL');

  const data = [];
  if (address) {
    data.push(address);
  } if (hours.length > 0) {
    data.push(...hours);
  } if (phone) {
    data.push(phone);
  } if (contact.length > 0) {
    data.push(...contact);
  }

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.contact.info" />}
      titleComponent="h3"
    />
  );
};

ContactInfo.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ContactInfo;
