import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import React from 'react';
import useMobileStatus from '../../utils/isMobile';
import UserHelper from '../../utils/user';
import HomeLogo from '../Logos/HomeLogo';
import styles from './styles';

export const ErrorComponent = withStyles(styles)(({
  classes,
  error,
}) => {
  let content = null;
  const theme = UserHelper.useTheme();
  const isMobile = useMobileStatus();
  const containerClasses = `${classes.viewContainer} ${isMobile && classes.viewMobileHeight}`;

  switch(error) {
    case 'error': {
      content = (
        <>
          <Typography variant="h6" component="p">Sivua ei pystytty avaamaan, yritäthän hetken päästä uudelleen <a href="/fi/">Palaa etusivulle</a></Typography>
          <Typography variant="h6" component="p">Sivua ei pystytty avaamaan, yritäthän hetken päästä uudelleen <a href="/sv/">Gå till startsidan</a></Typography>
          <Typography variant="h6" component="p">Sivua ei pystytty avaamaan, yritäthän hetken päästä uudelleen <a href="/en/">Return to frontpage</a></Typography>
        </>
      );
      break;
    }
    case 'badUrl':
    default:
      content = (
        <>
          <Typography variant="h6" component="p">Sivua ei valitettavasti löytynyt <a href="/fi/">Palaa etusivulle</a></Typography>
          <Typography variant="h6" component="p">Sidan hittades inte <a href="/sv/">Gå till startsidan</a></Typography>
          <Typography variant="h6" component="p">Page not found <a href="/en/">Return to frontpage</a></Typography>
        </>
      )
  }

  return (
    <div className={containerClasses}>
      <div className={classes.viewBackgroundCover} />
      <div className={classes.viewContent}>
        <HomeLogo aria-hidden contrast={theme === 'dark'} className={classes.viewLogo} />
        {content}
      </div>
    </div>
  );
});

export default ErrorComponent;
