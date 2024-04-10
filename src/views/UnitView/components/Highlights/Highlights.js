import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import config from '../../../../../config';
import useLocaleText from '../../../../utils/useLocaleText';
import unitSectionFilter from '../../utils/unitSectionFilter';
import { StyledAlignLeftParagraph, StyledLink, StyledVerticalMarginContainer } from '../styled/styled';

const Highlights = ({ unit }) => {
  const intl = useIntl();
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
    <StyledVerticalMarginContainer>
      {connections.map(item => (
        <StyledAlignLeftParagraph
          key={item.id}
          variant="body1"
        >
          {
              item.value.www
                ? (
                  <StyledLink href={getLocaleText(item.value.www)} target="_blank">
                    {getLocaleText(item.value.name)}
                    {' '}
                    <FormattedMessage id="opens.new.tab" />
                  </StyledLink>
                )
                : getLocaleText(item.value.name)
            }
        </StyledAlignLeftParagraph>
      ))}
    </StyledVerticalMarginContainer>
  );
};

Highlights.propTypes = {
  unit: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Highlights;
