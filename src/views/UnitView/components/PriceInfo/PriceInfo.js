import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import unitSectionFilter from '../../utils/unitSectionFilter';
import DescriptionText from '../../../../components/DescriptionText';
import useLocaleText from '../../../../utils/useLocaleText';

const PriceInfo = ({ unit }) => {
  const getLocaleText = useLocaleText();

  const data = unitSectionFilter(unit.connections, 'PRICE');
  let text = '';

  // Combine all price info to one text
  data.forEach((item) => {
    if (item.value?.name) {
      text += `${getLocaleText(item.value?.name)}\n`;
    }
  });

  if (!text.length) return null;

  return (
    <div>
      <DescriptionText
        description={text}
        title={<FormattedMessage id="unit.price" />}
        titleComponent="h4"
      />
    </div>
  );
};

PriceInfo.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PriceInfo;
