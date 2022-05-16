import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Typography, Link } from '@mui/material';
import unitSectionFilter from '../../utils/unitSectionFilter';
import useLocaleText from '../../../../utils/useLocaleText';
import { DescriptionText } from '../../../../components';

const Description = ({ unit, classes }) => {
  const getLocaleText = useLocaleText();

  const additionalInfo = [
    ...unitSectionFilter(unit.connections, 'OTHER_INFO'),
    ...unitSectionFilter(unit.connections, 'TOPICAL'),
  ];

  if (unit.description || additionalInfo.length) {
    return (
      <div>
        {/* Description */}
        {unit.description && (
          <DescriptionText
            description={getLocaleText(unit.description)}
            title={<FormattedMessage id="unit.description" />}
            titleComponent="h4"
          />
        )}
        {/* Other info texts + links */}
        {additionalInfo.map((item) => {
          if (item.value.www) {
            return (
              <Typography
                key={item.id}
                className={`${classes.paragraph} ${classes.left}`}
                variant="body2"
              >
                <Link className={classes.link} href={getLocaleText(item.value.www)} target="_blank">
                  {getLocaleText(item.value.name)}
                  {' '}
                  <FormattedMessage id="unit.opens.new.tab" />
                </Link>

              </Typography>
            );
          }
          return (
            <Typography
              key={item.id}
              className={`${classes.paragraph} ${classes.left}`}
              variant="body2"
            >
              {getLocaleText(item.value.name)}
            </Typography>
          );
        })}
      </div>
    );
  }
  return (
    null
  );
};

Description.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Description;
