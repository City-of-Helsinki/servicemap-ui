/* eslint-disable react/forbid-prop-types */
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fi';
import '@formatjs/intl-pluralrules/dist/locale-data/sv';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fi';
import '@formatjs/intl-relativetimeformat/dist/locale-data/sv';

import '@formatjs/intl-relativetimeformat/polyfill';
import { StyledEngineProvider } from '@mui/material';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { IntlProvider, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import appStyles from './App.css';
import ogImage from './assets/images/servicemap-meta-img.png';
import { DataFetcher, Navigator } from './components';
import HSLFonts from './hsl-icons.css';
import styles from './index.css';
import DefaultLayout from './layouts';
import EmbedLayout from './layouts/EmbedLayout';
import printCSS from './print.css';
import { getLocale } from './redux/selectors/locale';
import SMFonts from './service-map-icons.css';
import ThemeWrapper from './themes/ThemeWrapper';
import isClient from './utils';
import LocaleUtility from './utils/locale';
import EmbedderView from './views/EmbedderView';

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
      <meta property="og:image" data-react-helmet="true" content={ogImage} />
      <meta name="twitter:card" data-react-helmet="true" content="summary" />
      <meta name="twitter:image:alt" data-react-helmet="true" content={intl.formatMessage({ id: 'app.og.image.alt' })} />
    </Helmet>
  );
};

function App() {
  const locale = useSelector(getLocale);
  const intlData = LocaleUtility.intlData(locale);

  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <StyledEngineProvider>
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
    </StyledEngineProvider>
  );
}

// Wrapper to get language route
const LanguageWrapper = () => {
  if (isClient()) {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/:lng" component={App} />
        </Switch>
      </BrowserRouter>
    );
  }

  return (
    <Switch>
      <Route path="/:lng" component={App} />
    </Switch>
  );
};

export default withStyles(styles, appStyles, SMFonts, HSLFonts, printCSS)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
