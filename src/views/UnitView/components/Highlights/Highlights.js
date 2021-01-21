import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import config from '../../../../../config';
import unitSectionFilter from '../../utils/unitSectionFilter';

const Highlights = ({ unit, classes, getLocaleText }) => {
  const connections = unitSectionFilter(unit.connections, 'HIGHLIGHT');

  // Add link to ulkoliikunta.fi as custom highligh to certain services
  const outdoorSportIDs = [695, 406, 426, 731, 730, 191];
  const showOutdoorsLink = config.ulkoliikuntaURL
    && unit.services.some(service => outdoorSportIDs.includes(service.id));

  if (!connections?.length && !showOutdoorsLink) {
    return null;
  }

  if (showOutdoorsLink) {
    const outdoorsObject = {
      id: 'outdoorSports',
      value: {
        www: {
          fi: `${config.ulkoliikuntaURL}/unit/${unit.id}`,
          en: `${config.ulkoliikuntaURL}/unit/${unit.id}`,
          sv: `${config.ulkoliikuntaURL}/unit/${unit.id}`,
        },
        name: {
          fi: 'Katso liikuntapaikan kunto ulkoliikunta.fi palvelusta',
          en: 'Katso liikuntapaikan kunto ulkoliikunta.fi palvelusta',
          sv: 'Katso liikuntapaikan kunto ulkoliikunta.fi palvelusta',
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
  getLocaleText: PropTypes.func.isRequired,
};

export default Highlights;
