import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ButtonBase,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import styled from '@emotion/styled';

const CardSmall = ({ headerMessageID, messageID, onClick, image }) => {
  return (
    <ButtonBase onClick={onClick} role="link">
      <StyledCard>
        <StyledCardMedia
          component='img'
          height='auto'
          image={image}
          aria-hidden
        />
        <StyledCardContent>
          <StyledTextContainer>
            <Typography variant='subtitle1'>
              <FormattedMessage id={headerMessageID} />
            </Typography>
            <Typography variant='body2'>
              <FormattedMessage id={messageID} />
            </Typography>
          </StyledTextContainer>
          <StyledArrowForward />
        </StyledCardContent>
      </StyledCard>
    </ButtonBase>
  );
};

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

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
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

const StyledArrowForward = styled(ArrowForward)(({ theme }) => ({
  marginLeft: 'auto',
}));

CardSmall.propTypes = {
  headerMessageID: PropTypes.string.isRequired,
  messageID: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  image: PropTypes.string.isRequired,
};

export default CardSmall;
