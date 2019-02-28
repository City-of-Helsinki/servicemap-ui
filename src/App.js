import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import {
  MuiThemeProvider, Typography, Button, AppBar, Toolbar, Grid,
} from '@material-ui/core';
import withStyles from 'isomorphic-style-loader/withStyles';

import I18n from './i18n';
import themes from './themes';
import styles from './index.css';
import appStyles from './App.css';
import isClient from './utils';
import MapContainer from './views/Map/MapContainer';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    const i18n = new I18n();
    this.state = {
      i18n,
    };
  }

  componentDidMount() {
    // Get default locale from browser
    if (isClient()) {
      console.log('Browser locale: ', window.navigator.language);
      this.changeLocale(window.navigator.language);
    }
  }

  // Change locale of app
  changeLocale = (locale) => {
    if (locale) {
      const { i18n } = this.state;
      i18n.changeLocale(locale);
      this.setState({ i18n });
    }
  }

  render() {
    const { i18n } = this.state;
    const i18nData = i18n.data();
    return (
      <IntlProvider {...i18nData}>
        <MuiThemeProvider theme={themes.SMTheme}>
          <div className="App">
            <AppBar position="static">
              <Toolbar>
                <Grid
                  justify="space-between" // Add it here :)
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
                          <Button key={locale} color="secondary" onClick={() => this.changeLocale(locale)}>{i18n.localeText(locale)}</Button>
                        ))
                    }
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            <MapContainer />
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}
export default withStyles(styles, appStyles)(App);
