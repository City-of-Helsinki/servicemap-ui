import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import config from '../../../../../config';
import InfoList from '../InfoList';
import unitSectionFilter from '../../utils/unitSectionFilter';

const ContactInfo = ({
  unit, userLocation, getLocaleText, intl,
}) => {
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

  // For infomration that is in data's connections array, use unitSectionFilter
  const hours = unitSectionFilter(unit.connections, 'OPENING_HOURS');
  const contact = unitSectionFilter(unit.connections, 'PHONE_OR_EMAIL');

  // Temporary link implementation for route info
  const url = config.reittiopasURL;
  let currentLocationString = ' ';

  if (userLocation && userLocation.addressData) {
    const { street, number } = userLocation.addressData;
    const { latitude, longitude } = userLocation.coordinates;

    const userAddress = `${getLocaleText(street.name)} ${number}, ${street.municipality}`;
    currentLocationString = `${userAddress}::${latitude},${longitude}`;
  }

  // Form data array
  const data = [
    address,
    phone,
    email,
    website,
    ...contact.length ? contact : [],
    ...hours.length ? hours : [{ type: 'OPENING_HOURS', value: intl.formatMessage({ id: 'unit.opening.hours.missing' }) }],
  ];

  // Add route info to data in location exists
  const { location } = unit;

  if (location && location.coordinates) {
    const destinationString = `${getLocaleText(unit.name)}, ${unit.municipality}::${unit.location.coordinates[1]},${unit.location.coordinates[0]}`;
    const routeUrl = `${url}${currentLocationString}/${destinationString}?locale=${intl.locale}`;

    const route = {
      type: 'ROUTE',
      value: {
        www: routeUrl,
        name: intl.formatMessage({ id: 'unit.route' }),
        extraText: intl.formatMessage({ id: 'unit.route.extra' }),
      },
    };
    data.push(route);
  }

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
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
  getLocaleText: PropTypes.func.isRequired,
  userLocation: PropTypes.objectOf(PropTypes.any),
};

ContactInfo.defaultProps = {
  userLocation: null,
};

export default ContactInfo;
