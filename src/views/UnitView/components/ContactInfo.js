import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const ContactInfo = ({ unit }) => (
  <InfoList
    data={[
      { type: 'ADDRESS', value: unit.street_address },
      ...unitSectionFilter(unit.connections, 'OPENING_HOURS'),
      { type: 'PHONE', value: { phone: unit.phone } },
      ...unitSectionFilter(unit.connections, 'PHONE_OR_EMAIL'),
    ]}
    title={<FormattedMessage id="unit.contact.info" />}
    titleComponent="h4"
  />
);

ContactInfo.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ContactInfo;
