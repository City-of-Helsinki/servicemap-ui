import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import unitSectionFilter from '../../utils/unitSectionFilter';
import DescriptionText from '../../../../components/DescriptionText';
import useLocaleText from '../../../../utils/useLocaleText';

const PriceInfo = ({ unit }) => {
  const getLocaleText = useLocaleText();

  const data = unitSectionFilter(unit.connections, 'PRICE');
  const text = data.length && data[0].value?.name;

  if (!text) return null;

  return (
    <div>
      <DescriptionText
        description={getLocaleText(text)}
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
