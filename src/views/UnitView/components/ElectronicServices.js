import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const ElectronicServices = ({ unit, intl }) => {
  // List data: Homepage link and e-service links
  const data = [
    { type: 'LINK', value: unit.www ? { name: intl.formatMessage({ id: 'unit.homepage' }), www: unit.www } : null },
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
  intl: intlShape.isRequired,
};

export default injectIntl(ElectronicServices);
