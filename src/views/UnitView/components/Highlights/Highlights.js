import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import config from '../../../../../config';
import unitSectionFilter from '../../utils/unitSectionFilter';
import useLocaleText from '../../../../utils/useLocaleText';

const Highlights = ({ unit, classes, intl }) => {
  const getLocaleText = useLocaleText();
  const connections = unitSectionFilter(unit.connections, 'HIGHLIGHT');

  // Add link to ulkoliikunta.fi as custom highligh to certain services
  const outdoorSportIDs = [695, 406, 426, 731, 730, 191];
  const showOutdoorsLink = config.outdoorExerciseURL !== 'undefined'
    && unit.services.some(service => outdoorSportIDs.includes(service.id));

  if (!connections?.length && !showOutdoorsLink) {
    return null;
  }

  if (showOutdoorsLink) {
    const outdoorsObject = {
      id: 'outdoorExercise',
      value: {
        www: {
          fi: `${config.outdoorExerciseURL}/unit/${unit.id}`,
          en: `${config.outdoorExerciseURL}/unit/${unit.id}`,
          sv: `${config.outdoorExerciseURL}/unit/${unit.id}`,
        },
        name: {
          fi: intl.formatMessage({ id: 'unit.outdoorLink' }),
          en: intl.formatMessage({ id: 'unit.outdoorLink' }),
          sv: intl.formatMessage({ id: 'unit.outdoorLink' }),
        },
      },
    };
    connections.push(outdoorsObject);
  }

  return (
    <div className={classes.marginVertical}>
      {connections.map(item => (
        <Typography
          key={item.id}
          className={`${classes.left} ${classes.paragraph}`}
          variant="body1"
        >
          {
              item.value.www
                ? (
                  <Link className={classes.link} href={getLocaleText(item.value.www)} target="_blank">
                    {getLocaleText(item.value.name)}
                    {' '}
                    <FormattedMessage id="unit.opens.new.tab" />
                  </Link>
                )
                : getLocaleText(item.value.name)
            }
        </Typography>
      ))}
    </div>
  );
};

Highlights.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Highlights;
