import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, intlShape } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const ContactInfo = ({ unit, intl }) => {
  const address = {
    type: 'ADDRESS',
    value: unit.street_address ? unit.street_address : intl.formatMessage({ id: 'unit.address.missing' }),
  };
  const phone = {
    type: 'PHONE',
    value: unit.phone ? { phone: unit.phone } : intl.formatMessage({ id: 'unit.phone.missing' }),
  };
  const email = {
    type: 'EMAIL',
    value: unit.email ? { email: unit.email } : intl.formatMessage({ id: 'unit.email.missing' }),
  };
  const website = {
    type: 'LINK',
    value: unit.www ? {
      www: unit.www,
      name: intl.formatMessage({ id: 'unit.homepage' }),
    } : intl.formatMessage({ id: 'unit.homepage.missing' }),
  };

  // Temporary link implementation for route info
  const { locale } = intl;
  const url = 'https://reittiopas.hsl.fi/reitti/%20/';
  const routeUrl = `${url}${unit.name[locale]}, ${unit.municipality}::${unit.location.coordinates[1]},${unit.location.coordinates[0]}?locale=${intl.locale}`;

  const route = {
    type: 'ROUTE',
    value: {
      www: routeUrl,
      name: intl.formatMessage({ id: 'unit.route' }),
      extraText: intl.formatMessage({ id: 'unit.route.extra' }),
    },
  };

  // For infomration that is in data's connections array, use unitSectionFilter
  const hours = unitSectionFilter(unit.connections, 'OPENING_HOURS');
  const contact = unitSectionFilter(unit.connections, 'PHONE_OR_EMAIL');

  // Form data array
  const data = [
    address,
    phone,
    email,
    website,
    ...contact.length ? contact : [],
    ...hours.length ? hours : [{ type: 'OPENING_HOURS', value: intl.formatMessage({ id: 'unit.opening.hours.missing' }) }],
    route,
  ];

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.contact.info" />}
      titleComponent="h4"
    />
  );
};

ContactInfo.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
};

export default ContactInfo;
