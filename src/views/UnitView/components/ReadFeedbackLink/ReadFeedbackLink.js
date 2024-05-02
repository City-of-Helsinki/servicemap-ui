import styled from '@emotion/styled';
import { Link } from 'hds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import config from '../../../../../config';
import useLocaleText from '../../../../utils/useLocaleText';
import { StyledAlignLeftParagraph, StyledVerticalMarginContainer } from '../styled/styled';

const ReadFeedbackLink = ({ unit }) => {
  const getLocaleText = useLocaleText();
  const intl = useIntl();
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
  const text = intl.formatMessage({ id: 'unit.readFeedbackLink' });
  return (
    <StyledVerticalMarginContainer>
      <StyledAlignLeftParagraph variant="body1">
        <StyledHdsLink
          href={url}
          size="M"
          external
          openInNewTab
          openInExternalDomainAriaLabel={intl.formatMessage({ id: 'general.linkLeadsToExternalSite' })}
          openInNewTabAriaLabel={intl.formatMessage({ id: 'general.new.tab' })}
        >
          {text}
        </StyledHdsLink>
      </StyledAlignLeftParagraph>
    </StyledVerticalMarginContainer>
  );
};

const StyledHdsLink = styled(Link)(({ theme }) => ({
  display: 'block',
  width: 'fit-content',
  fontSize: theme.typography.body2.fontSize,
  letterSpacing: theme.typography.body2.letterSpacing,
  lineHeight: theme.typography.body2.lineHeight,
}));

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
