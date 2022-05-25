import { Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useUserTheme } from '../../utils/user';
import HomeLogo from '../Logos/HomeLogo';
import styles from './styles';

export const ErrorComponent = withStyles(styles)(({
  classes,
  error,
}) => {
  let content = null;
  const theme = useUserTheme();
  const containerClasses = `${classes.viewContainer}`;

  switch(error) {
    case 'error': {
      content = (
        <>
          <Typography variant="h6" component="p" lang="fi">Sivua ei pystytty avaamaan, yritäthän hetken päästä uudelleen <a href="/fi/">Palaa etusivulle</a></Typography>
          <Typography variant="h6" component="p" lang="sv">Sidan kunde inte laddas, vänligen försök igen om en stund <a href="/sv/">Gå tillbaka till framsidan</a></Typography>
          <Typography variant="h6" component="p" lang="en">The page could not be loaded, please try again in a few moments <a href="/en/">Return to the home page</a></Typography>
        </>
      );
      break;
    }
    case 'badUrl':
    default:
      content = (
        <>
          <Typography variant="h6" component="p" lang="fi">Sivua ei valitettavasti löytynyt <a href="/fi/">Palaa etusivulle</a></Typography>
          <Typography variant="h6" component="p" lang="sv">Sidan kunde tyvärr inte hittas <a href="/sv/">Gå tillbaka till framsidan</a></Typography>
          <Typography variant="h6" component="p" lang="en">The page could unfortunately not be found <a href="/en/">Return to the home page</a></Typography>
        </>
      )
  }

  return (
    <div className={containerClasses}>
      <div className={classes.viewBackgroundCover} />
      <div className={classes.viewContent}>
        <HomeLogo aria-hidden contrast={theme === 'dark'} className={classes.viewLogo} />
        <Typography style={visuallyHidden} component="h1"><FormattedMessage id="app.errorpage.title" /></Typography>
        {content}
      </div>
    </div>
  );
});

export default ErrorComponent;
