import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from '@mui/material';
import styled from '@emotion/styled';

const DescriptionText = ({
  description, html, title, titleComponent,
}) => {
  // Hide linebreak html elements from screen readers
  const hideBRFromSR = text => text.replaceAll('<br>', '<br aria-hidden="true" />');

  // TODO: Figure out a way to have server render description text identical to client
  // NOTE: tried using NoSSR-tag. It fixed mismatch error, however it broke GitHub actions tests

  if (description) {
    return (
      <StyledDiv>
        <StyledTypographySubtitle
          component={titleComponent}
          variant="subtitle1"
        >
          {title}
        </StyledTypographySubtitle>
        <StyledDivider aria-hidden="true" />
        { !html ? (
          <StyledTypographyParagraph variant="body2">
            {description}
          </StyledTypographyParagraph>
        ) : (
          <StyledTypographyParagraph dangerouslySetInnerHTML={{ __html: hideBRFromSR(description) }} variant="body2" />
        )}
      </StyledDiv>
    );
  }
  return null;
};

const StyledDiv = styled('div')(() => ({
  textAlign: 'left',
}));

const StyledTypographyParagraph = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
  whiteSpace: 'pre-line',
}));

const StyledTypographySubtitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginLeft: theme.spacing(-2),
  marginRight: theme.spacing(-2),
}));

DescriptionText.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  html: PropTypes.bool,
  titleComponent: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).isRequired,
};

DescriptionText.defaultProps = {
  html: false,
};


export default DescriptionText;
