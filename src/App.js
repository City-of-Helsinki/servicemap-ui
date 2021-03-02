/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import withStyles from 'isomorphic-style-loader/withStyles';
import {
  Switch, Route, BrowserRouter,
} from 'react-router-dom';

import styles from './index.css';
import SMFonts from './service-map-icons.css';
import HSLFonts from './hsl-icons.css';
import appStyles from './App.css';
import printCSS from './print.css';
import isClient from './utils';
import { getLocale } from './redux/selectors/locale';
import { changeLocaleAction } from './redux/actions/user';
import DefaultLayout from './layouts';
import EmbedLayout from './layouts/EmbedLayout';
import Navigator from './components/Navigator';
import DataFetcher from './components/DataFetchers/DataFetcher';
import EmbedderView from './views/EmbedderView';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fi';
import '@formatjs/intl-pluralrules/dist/locale-data/sv';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fi';
import '@formatjs/intl-relativetimeformat/dist/locale-data/sv';
import ThemeWrapper from './themes/ThemeWrapper';
import LocaleUtility from './utils/locale';
import config from '../config';

// General meta tags for app
const MetaTags = () => {
  const intl = useIntl();
  return (
    <Helmet>
      <meta property="og:site_name" content={intl.formatMessage({ id: 'app.title' })} />
      {
        isClient() && <meta property="og:url" content={window.location} />
      }
      <meta property="og:description" content={intl.formatMessage({ id: 'app.description' })} />
    </Helmet>
  );
};

class App extends React.Component {
  // Remove the server-side injected CSS.
  componentDidMount() {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { locale } = this.props;
    const intlData = LocaleUtility.intlData(locale);

    return (
      <ThemeWrapper>
        <IntlProvider {...intlData}>
          <MetaTags />
          {/* <StylesProvider generateClassName={generateClassName}> */}
          <div className="App">
            <Switch>
              <Route path="*/embedder" component={EmbedderView} />
              <Route path="*/embed" component={EmbedLayout} />
              <Route render={() => <DefaultLayout />} />
            </Switch>
            <Navigator />
            <DataFetcher />
          </div>
          {/* </StylesProvider> */}
        </IntlProvider>
      </ThemeWrapper>
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

export default withStyles(styles, appStyles, SMFonts, HSLFonts, printCSS)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  locale: PropTypes.oneOf(config.supportedLanguages).isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changeLocaleAction: PropTypes.func.isRequired,
};
