import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import {
  MuiThemeProvider, Typography, Button,
} from '@material-ui/core';

import I18n from './i18n';
import themes from './themes';
import './App.css';
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
            <Typography variant="body1">
              <FormattedMessage id="app.title" />
            </Typography>
            <Button onClick={() => this.changeLocale('en')}>En</Button>
            <Button onClick={() => this.changeLocale('fi')}>Fi</Button>
            <MapContainer />
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}
export default App;
