import React from 'react'
import './App.css'
import { IntlProvider, FormattedMessage } from 'react-intl';
import i18n from './i18n';

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
        <div className="App">
          <FormattedMessage id="app.title" />
        </div>
      </IntlProvider>
    );
  }
}

export default App
