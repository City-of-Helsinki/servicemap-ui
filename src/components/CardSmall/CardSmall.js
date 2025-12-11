import styled from '@emotion/styled';
import { ArrowForward } from '@mui/icons-material';
import {
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

function CardSmall({ headerMessageID, messageID, onClick, image }) {
  return (
    <StyledButtonBase onClick={onClick} role="link">
      <StyledCard>
        <StyledCardMedia
          component="img"
          height="auto"
          image={image}
          aria-hidden
        />
        <StyledCardContent>
          <StyledTextContainer>
            <Typography variant="subtitle1" component="h3">
              <FormattedMessage id={headerMessageID} />
            </Typography>
            <Typography variant="body2">
              <FormattedMessage id={messageID} />
            </Typography>
          </StyledTextContainer>
          <StyledArrowForward />
        </StyledCardContent>
      </StyledCard>
    </StyledButtonBase>
  );
}

const StyledButtonBase = styled(ButtonBase)(() => ({
  width: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  overflow: 'visible',
  marginBottom: theme.spacing(1),
  border: `1px solid ${theme.palette.border.main}`,
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.hover.main,
    transition: '0.2s',
  },
  '&:hover svg': {
    // color: theme.palette.primary.main,
  },
}));

const StyledCardMedia = styled(CardMedia)(() => ({
  width: 80,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  padding: `${theme.spacing(2)} !important`,
}));

const StyledTextContainer = styled.div(({ theme }) => ({
  flexDirection: 'column',
  textAlign: 'left',
  paddingRight: theme.spacing(1),
}));

const StyledArrowForward = styled(ArrowForward)(() => ({
  marginLeft: 'auto',
}));

CardSmall.propTypes = {
  headerMessageID: PropTypes.string.isRequired,
  messageID: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};

export default CardSmall;
