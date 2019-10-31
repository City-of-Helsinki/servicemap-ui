import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const ElectronicServices = ({ unit }) => {
  // List data: Homepage link and e-service links
  const data = [
    ...unitSectionFilter(unit.connections, 'ESERVICE_LINK'),
  ];

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.eServices" />}
      titleComponent="h3"
    />
  );
};

ElectronicServices.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(ElectronicServices);
