
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Grid, Typography, AppBar, Toolbar, withStyles,
} from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import Sidebar from '../views/Sidebar';
import MapContainer from '../views/Map/MapContainer';
import I18n from '../i18n';

const createContentStyles = isMobile => ({
  sidebar: {
    width: isMobile ? '100%' : 360,
    margin: 0,
  },
  map: {
    display: isMobile ? 'none' : 'block',
    margin: 0,
  },
});

const styles = {
  activeRoot: {
    flexGrow: 1,
    margin: 0,
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
};


const DefaultLayout = (props) => {
  const { classes, i18n, onLanguageChange } = props;
  const isMobile = useMediaQuery('(max-width:719px)');
  const styles = createContentStyles(isMobile);

  return (
    <>
      {
        !isMobile
        && (
        <AppBar position="relative" style={{ height: 64 }}>
          <Toolbar>
            <Grid
              justify="space-between"
              container
              spacing={24}
            >
              <Grid item>
                <Typography color="secondary" variant="body1">
                  <FormattedMessage id="app.title" />
                </Typography>
              </Grid>
              <Grid item>
                {
                  i18n.availableLocales
                    .filter(locale => locale !== i18n.locale)
                    .map(locale => (
                      <Button key={locale} color="secondary" onClick={() => onLanguageChange(locale)}>{i18n.localeText(locale)}</Button>
                    ))
                }
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        )
      }
      <div className={classes.activeRoot}>
        <div style={styles.sidebar}>
          <Sidebar />
        </div>
        {
        !isMobile
        && (
        <div style={styles.map}>
          <MapContainer />
        </div>
        )
      }
      </div>
    </>
  );
};

// Typechecking
DefaultLayout.propTypes = {
  i18n: PropTypes.instanceOf(I18n),
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

DefaultLayout.defaultProps = {
  i18n: null,
};

export default withStyles(styles)(DefaultLayout);
