import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const ElectronicServices = ({ unit, intl }) => (
  <InfoList
    data={[
      { type: 'LINK', value: unit.www ? { name: intl.formatMessage({ id: 'unit.homepage' }), www: unit.www } : null },
      // ...this.sectionFilter(unit.connections, 'LINK'),
      ...unitSectionFilter(unit.connections, 'ESERVICE_LINK'),
    ]}
    title={<FormattedMessage id="unit.e.services" />}
    titleComponent="h4"
  />
);

ElectronicServices.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(ElectronicServices);
