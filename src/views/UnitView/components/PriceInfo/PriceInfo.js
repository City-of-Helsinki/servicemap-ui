import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, Typography } from '@mui/material';
import unitSectionFilter from '../../utils/unitSectionFilter';
import useLocaleText from '../../../../utils/useLocaleText';
import { DescriptionText } from '../../../../components';

const PriceInfo = ({ unit, classes }) => {
  const getLocaleText = useLocaleText();

  const data = unitSectionFilter(unit.connections, 'PRICE');

  const renderLink = link => (
    <>
      <Typography
        key={link.id}
        variant="body2"
      >
        <Link className={classes.link} href={getLocaleText(link.value.www)} target="_blank">
          {getLocaleText(link.value.name)}
          {' '}
          <FormattedMessage id="unit.opens.new.tab" />
        </Link>
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
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PriceInfo;
