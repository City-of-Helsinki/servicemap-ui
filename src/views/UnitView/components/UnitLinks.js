import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import InfoList from './InfoList';
import unitSectionFilter from '../utils/unitSectionFilter';

const UnitLinks = ({ unit }) => {
  // List data: Homepage link and e-service links
  const data = [
    ...unitSectionFilter(unit.connections, 'LINK'),
  ];

  return (
    <InfoList
      data={data}
      title={<FormattedMessage id="unit.links" />}
      titleComponent="h4"
    />
  );
};

UnitLinks.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(UnitLinks);
