import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import unitSectionFilter from '../../utils/unitSectionFilter';
import InfoList from '../InfoList';

function ElectronicServices({ unit }) {
  // List data: Homepage link and e-service links
  const data = [...unitSectionFilter(unit.connections, 'ESERVICE_LINK')];

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.eServices" />}
      titleComponent="h4"
    />
  );
}

ElectronicServices.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ElectronicServices;
