/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import {
  MuiThemeProvider,
} from '@material-ui/core';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  Switch, Route, BrowserRouter,
} from 'react-router-dom';

import I18n from './i18n';
import themes from './themes';
import styles from './index.css';
import appStyles from './App.css';
import isClient from './utils';
import { getLocale } from './redux/selectors/locale';
import { changeLocaleAction } from './redux/actions/locale';
import DefaultLayout from './layouts';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    const { match } = this.props;
    const newLocale = match.params.lng;
    const i18n = new I18n();

    if (i18n.isValidLocale(newLocale)) {
      i18n.changeLocale(newLocale);
    }

    this.state = {
      i18n,
    };
  }

  // Change locale of app
  changeLocale = (locale) => {
    if (locale) {
      const { i18n } = this.state;
      const { history, location, changeLocaleAction } = this.props;

      // but you can use a location instead
      if (history && location) {
        const pathArray = location.pathname.split('/');
        pathArray[1] = locale; // Change locale in path

        // Change location
        const newLocation = location;
        newLocation.pathname = pathArray.join('/');

        history.push(newLocation);
        i18n.changeLocale(locale);
        // this.setState({ i18n });
        if (changeLocaleAction) {
          changeLocaleAction(i18n.locale);
        }
      }
    }
  }

  render() {
    const { i18n } = this.state;
    const i18nData = i18n.data();
    return (
      <IntlProvider {...i18nData}>
        <MuiThemeProvider theme={themes.SMTheme}>
          <div className="App">
            <DefaultLayout i18n={i18n} onLanguageChange={locale => this.changeLocale(locale)} />
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}

// Listen to redux state
const mapStateToProps = (state) => {
  const locale = getLocale(state);
  return {
    locale,
  };
};

const ConnectedApp = connect(
  mapStateToProps,
  { changeLocaleAction },
)(App);

// Wrapper to get language route
const LanguageWrapper = () => {
  if (isClient()) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/:lng" component={ConnectedApp} />
        </Switch>
      </BrowserRouter>
    );
  }

  return (
    <Switch>
      <Route path="/:lng" component={ConnectedApp} />
    </Switch>
  );
};

export default withStyles(styles, appStyles)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changeLocaleAction: PropTypes.func.isRequired,
};
