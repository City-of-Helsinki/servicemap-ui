import React from 'react'
import { IntlProvider, FormattedMessage } from 'react-intl';
import { MuiThemeProvider, Typography } from '@material-ui/core';

import './App.css'
import i18n from './i18n';
import themes from './themes';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    this.state = {
      i18n: new i18n()
    }
  }
  render() {
    const { i18n } = this.state;
    const i18nData = i18n.data();
    return (
      <IntlProvider {...i18nData}>
        <MuiThemeProvider theme={themes.SMTheme}>
          <div className="App">
            <Typography variant={'p'}>
              <FormattedMessage id="app.title" />
            </Typography>
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}

export default App
