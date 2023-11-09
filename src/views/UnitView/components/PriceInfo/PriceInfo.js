import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DescriptionText } from '../../../../components';
import useLocaleText from '../../../../utils/useLocaleText';
import unitSectionFilter from '../../utils/unitSectionFilter';
import { StyledLink } from '../styled/styled';

const PriceInfo = ({ unit }) => {
  const getLocaleText = useLocaleText();

  const data = unitSectionFilter(unit.connections, 'PRICE');

  const renderLink = link => (
    <>
      <Typography
        key={link.id}
        variant="body2"
      >
        <StyledLink href={getLocaleText(link.value.www)} target="_blank">
          {getLocaleText(link.value.name)}
          {' '}
          <FormattedMessage id="opens.new.tab" />
        </StyledLink>
      </Typography>
      <br />
    </>
  );


  const getTextContent = () => (
    <>
      {data.map((item) => {
        if (item.value?.www) return renderLink(item);
        if (item.value?.name) {
          return (
            <>
              <Typography>{`${getLocaleText(item.value?.name)}`}</Typography>
              <br />
            </>
          );
        }
        return null;
      })}
    </>
  );

  if (!data.length) return null;

  return (
    <div>
      <DescriptionText
        description={getTextContent()}
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
