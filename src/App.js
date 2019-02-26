import React from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import {
  MuiThemeProvider, Typography,
} from '@material-ui/core';

import I18n from './i18n';
import themes from './themes';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    const defaultLocale = 'fi';
    const i18n = new I18n({ locale: defaultLocale });
    this.state = {
      i18n,
    };
  }

  // Change locale of app
  _changeLocale = (locale) => {
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
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}
export default App;
