/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  Switch, Route, BrowserRouter,
} from 'react-router-dom';

import I18n from './i18n';
import styles from './index.css';
import SMFonts from './service-map-icons.css';
import appStyles from './App.css';
import isClient from './utils';
import { getLocale } from './redux/selectors/locale';
import { changeLocaleAction } from './redux/actions/user';
import DefaultLayout from './layouts';
import Navigator from './utils/components/Navigator';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Default state
    const { changeLocaleAction, match } = this.props;
    const newLocale = match.params.lng;
    const i18n = new I18n();

    if (i18n.isValidLocale(newLocale)) {
      i18n.changeLocale(newLocale);
      changeLocaleAction(newLocale);
    }

    this.state = {
      i18n,
    };
  }

  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { i18n } = this.state;
    const i18nData = i18n.data();
    return (
      <IntlProvider {...i18nData}>
        <div className="App">
          <DefaultLayout i18n={i18n} />
          <Navigator />
        </div>
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

export default withStyles(styles, appStyles, SMFonts)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changeLocaleAction: PropTypes.func.isRequired,
};
