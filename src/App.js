/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import { css, Global } from '@emotion/react';
import '@formatjs/intl-pluralrules/dist/locale-data/en';
import '@formatjs/intl-pluralrules/dist/locale-data/fi';
import '@formatjs/intl-pluralrules/dist/locale-data/sv';

import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/dist/locale-data/en';
import '@formatjs/intl-relativetimeformat/dist/locale-data/fi';
import '@formatjs/intl-relativetimeformat/dist/locale-data/sv';

import '@formatjs/intl-relativetimeformat/polyfill';
import { StyledEngineProvider } from '@mui/material';
// To add css variables for hds components
import hdsStyle from 'hds-design-tokens';
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
import SMCookies from './components/SMCookies/SMCookies';
import HSLFonts from './hsl-icons.css';
import styles from './index.css';
import DefaultLayout from './layouts';
import EmbedLayout from './layouts/EmbedLayout';
import printCSS from './print.css';
import { getLocale } from './redux/selectors/user';
import SMFonts from './service-map-icons.css';
import ThemeWrapper from './themes/ThemeWrapper';
import isClient from './utils';
import LocaleUtility from './utils/locale';
import EmbedderView from './views/EmbedderView';
import useMobileStatus from './utils/isMobile';
import { COOKIE_MODAL_ROOT_ID } from './utils/constants';

// General meta tags for app
function MetaTags() {
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
}

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

  const isMobile = useMobileStatus();

  return (
    <StyledEngineProvider>
      <Global
        styles={css({
          // hide language selector in hds cookie modal
          '#cookie-consent-language-selector-button': {
            display: 'none',
          },
          ...isMobile && ({
            [`#${COOKIE_MODAL_ROOT_ID} > div > div`]: {
              bottom: '4.875rem',
            },
          }),
        })}
      />
      <ThemeWrapper>
        <IntlProvider {...intlData}>
          <MetaTags />
          {/* <StylesProvider generateClassName={generateClassName}> */}
          <SMCookies />
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
function LanguageWrapper() {
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
}

// eslint-disable-next-line max-len
export default withStyles(styles, appStyles, SMFonts, HSLFonts, printCSS, hdsStyle)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
