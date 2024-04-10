import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import config from '../../../../../config';
import useLocaleText from '../../../../utils/useLocaleText';
import { StyledAlignLeftParagraph, StyledLink, StyledVerticalMarginContainer } from '../styled/styled';

const ReadFeedbackLink = ({ unit }) => {
  const getLocaleText = useLocaleText();
  const resolveUrl = () => {
    const URLs = config.readFeedbackURLS;
    if (unit.municipality === 'helsinki') {
      return getLocaleText(URLs.helsinki) + getLocaleText(unit.name);
    }
    return null;
  };
  const url = resolveUrl();
  if (!url) {
    return null;
  }
  return (
    <StyledVerticalMarginContainer>
      <StyledAlignLeftParagraph variant="body1">
        <StyledLink href={url} target="_blank">
          <FormattedMessage id="unit.readFeedbackLink" />
        </StyledLink>
      </StyledAlignLeftParagraph>
    </StyledVerticalMarginContainer>
  );
};

ReadFeedbackLink.propTypes = {
  unit: PropTypes.shape({
    municipality: PropTypes.string.isRequired,
    name: PropTypes.shape({
      fi: PropTypes.string.isRequired,
      sv: PropTypes.string.isRequired,
      en: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default ReadFeedbackLink;
