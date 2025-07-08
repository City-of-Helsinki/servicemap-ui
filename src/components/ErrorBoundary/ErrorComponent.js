import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { selectThemeMode } from '../../redux/selectors/user';
import { BackGroundCover, StyledContent, StyledDiv, ViewLogo } from './styles';

export const ErrorComponent = ({ error }) => {
  let content = null;
  const themeMode = useSelector(selectThemeMode);

  switch (error) {
    case 'error': {
      content = (
        <>
          <Typography variant="h6" component="p" lang="fi">
            Sivua ei pystytty avaamaan, yritäthän hetken päästä uudelleen{' '}
            <a href="/fi/">Palaa etusivulle</a>
          </Typography>
          <Typography variant="h6" component="p" lang="sv">
            Sidan kunde inte laddas, vänligen försök igen om en stund{' '}
            <a href="/sv/">Gå tillbaka till framsidan</a>
          </Typography>
          <Typography variant="h6" component="p" lang="en">
            The page could not be loaded, please try again in a few moments{' '}
            <a href="/en/">Return to the home page</a>
          </Typography>
        </>
      );
      break;
    }
    case 'badUrl':
    default:
      content = (
        <>
          <Typography variant="h6" component="p" lang="fi">
            Sivua ei valitettavasti löytynyt <a href="/fi/">Palaa etusivulle</a>
          </Typography>
          <Typography variant="h6" component="p" lang="sv">
            Sidan kunde tyvärr inte hittas{' '}
            <a href="/sv/">Gå tillbaka till framsidan</a>
          </Typography>
          <Typography variant="h6" component="p" lang="en">
            The page could unfortunately not be found{' '}
            <a href="/en/">Return to the home page</a>
          </Typography>
        </>
      );
  }

  return (
    <StyledDiv>
      <BackGroundCover />
      <StyledContent>
        <ViewLogo aria-hidden contrast={themeMode === 'dark'} />
        <Typography style={visuallyHidden} component="h1">
          <FormattedMessage id="app.errorpage.title" />
        </Typography>
        {content}
      </StyledContent>
    </StyledDiv>
  );
};

ErrorComponent.propTypes = {
  error: PropTypes.any.isRequired,
};

export default ErrorComponent;
