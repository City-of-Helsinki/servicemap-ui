import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TitledList from '../../../components/Lists/TitledList';
import ServiceItem from '../../../components/ListItems/ServiceItem';

const Services = ({ unit }) => (
  <TitledList
    title={<FormattedMessage id="unit.services" />}
    titleComponent="h4"
  >
    {
      unit.services.map(service => (
        <ServiceItem key={service.id} service={service} />
      ))
    }
  </TitledList>
);

Services.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Services;
