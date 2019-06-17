import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TitledList from '../../../components/Lists/TitledList';
import ServiceItem from '../../../components/ListItems/ServiceItem';

const Services = ({ unit, listLength, navigator }) => (
  <TitledList
    title={<FormattedMessage id="unit.services" />}
    titleComponent="h4"
    listLength={listLength}
    buttonText={<FormattedMessage id="unit.moreServices" values={{ count: unit.services.length }} />}
    showMoreOnClick={listLength
      ? (e) => {
        e.preventDefault();
        if (navigator) {
          navigator.push('unitFullList', { id: unit.id, type: 'services' });
        }
      } : null}
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
  listLength: PropTypes.number,
  navigator: PropTypes.objectOf(PropTypes.any),
};

Services.defaultProps = {
  listLength: null,
  navigator: null,
};

export default Services;
