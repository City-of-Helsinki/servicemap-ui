import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import config from '../../../../../config';
import useLocaleText from '../../../../utils/useLocaleText';
import unitSectionFilter from '../../utils/unitSectionFilter';
import InfoList from '../InfoList';

function UnitLinks({ unit }) {
  const getLocaleText = useLocaleText();
  // List data: Homepage link and e-service links
  const data = [...unitSectionFilter(unit.connections, 'LINK')];

  // Filter out duplicate feedback links, since we already have feedback button
  const filteredData = data.filter((link) => {
    const feedbackUrls = Object.values(config.additionalFeedbackURLs);
    if (
      link.value?.www &&
      feedbackUrls.includes(getLocaleText(link.value.www))
    ) {
      return false;
    }
    return true;
  });

  return (
    <InfoList
      data={filteredData}
      title={<FormattedMessage id="unit.links" />}
      titleComponent="h4"
    />
  );
}

UnitLinks.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default UnitLinks;
