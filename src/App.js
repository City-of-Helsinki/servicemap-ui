/* eslint-disable react/jsx-props-no-spreading */
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
// To add css variables for hds components
import hdsStyle from 'hds-design-tokens';
import { CookieBanner, CookieConsentContextProvider } from 'hds-react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { IntlProvider, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';

import config from '../config';
import appStyles from './App.css';
import ogImage from './assets/images/servicemap-meta-img.png';
import { DataFetcher, Navigator } from './components';
import useMatomo from './components/Matomo/hooks/useMatomo';
import MatomoContext from './components/Matomo/matomo-context';
import MatomoTracker from './components/Matomo/MatomoTracker';
//import SMCookies from './components/SMCookies/SMCookies';
import HSLFonts from './hsl-icons.css';
import styles from './index.css';
import DefaultLayout from './layouts';
import EmbedLayout from './layouts/EmbedLayout';
import printCSS from './print.css';
import { selectMobility, selectSenses } from './redux/selectors/settings';
import { getLocale } from './redux/selectors/user';
import SMFonts from './service-map-icons.css';
import ThemeWrapper from './themes/ThemeWrapper';
import isClient from './utils';
import useMobileStatus from './utils/isMobile';
import LocaleUtility from './utils/locale';
import { isEmbed } from './utils/path';
import siteSettings from './utils/siteSettings.json';
import { servicemapTrackPageView } from './utils/tracking';
// import useCookieConsentSettings from './utils/useCookieConsentSettings';
import EmbedderView from './views/EmbedderView';

// General meta tags for app
function MetaTags() {
  const intl = useIntl();
  return (
    <Helmet>
      <meta
        property="og:site_name"
        content={intl.formatMessage({ id: 'app.title' })}
      />
      {isClient() && <meta property="og:url" content={window.location} />}
      <meta
        property="og:description"
        content={intl.formatMessage({ id: 'app.description' })}
      />
      <meta property="og:image" data-react-helmet="true" content={ogImage} />
      <meta name="twitter:card" data-react-helmet="true" content="summary" />
      <meta
        name="twitter:image:alt"
        data-react-helmet="true"
        content={intl.formatMessage({ id: 'app.og.image.alt' })}
      />
    </Helmet>
  );
}

function App() {
  const locale = useSelector(getLocale);
  const intlData = LocaleUtility.intlData(locale);
  const { trackPageView } = useMatomo();
  const location = useLocation();
  const senses = useSelector(selectSenses);
  const mobility = useSelector(selectMobility);
  const isMobile = useMobileStatus();

  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    // Simple custom servicemap page view tracking
    servicemapTrackPageView();

    if (!isEmbed()) {
      trackPageView({
        href: window.location.href,
        ...(config.matomoMobilityDimensionID &&
          config.matomoSensesDimensionID && {
            customDimensions: [
              { id: config.matomoMobilityDimensionID, value: mobility || '' },
              { id: config.matomoSensesDimensionID, value: senses?.join(',') },
            ],
          }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search, mobility, senses]);


  // Override cookie modal styling in shadow root
  useEffect(() => {
    if (!isMobile) return; // Only run on mobile devices

    const observer = new MutationObserver(() => {
      const host = document.querySelector('.hds-cc__target');
      if (host && host.shadowRoot) {
        // inject once and stop observing
        const shadow = host.shadowRoot;
        const style = document.createElement('style');
        style.textContent = `
        .hds-cc__container {
          bottom: 4.875rem !important;
        }
      `;
        shadow.appendChild(style);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isMobile]);

 

  // const cookieConsentProps = useCookieConsentSettings();

  return (
    <StyledEngineProvider>
      <ThemeWrapper>
        <IntlProvider {...intlData}>
          <MetaTags />
          {/* <StylesProvider generateClassName={generateClassName}> */}
           {/* <CookieConsentContextProvider {...cookieConsentProps}> */}
          <CookieConsentContextProvider
            siteSettings={siteSettings}
            options={{ language: locale }}
          >
            <div className="App">
              <Switch>
                <Route path="*/embedder" component={EmbedderView} />
                <Route path="*/embed" component={EmbedLayout} />
                <Route render={() => <DefaultLayout />} />
              </Switch>
              <Navigator />
              <DataFetcher />
              {!isEmbed() && <CookieBanner />}
            </div>
          </CookieConsentContextProvider>
          {/* </StylesProvider> */}
        </IntlProvider>
      </ThemeWrapper>
    </StyledEngineProvider>
  );
}

// Wrapper to get language route
function LanguageWrapper() {
  const matomoTracker = useMemo(() => {
    if (config.matomoUrl && config.matomoSiteId && config.matomoEnabled) {
      return new MatomoTracker({
        urlBase: `//${config.matomoUrl}/`,
        siteId: config.matomoSiteId,
        trackerUrl: 'tracker.php',
        srcUrl: 'piwik.min.js',
        enabled: config.matomoEnabled === 'true' && !isEmbed(),
        linkTracking: false,
        configurations: {
          requireCookieConsent: undefined,
        },
      });
    }

    return null;
  }, []);

  if (isClient()) {
    console.log('matomo app');
    return (
      <MatomoContext.Provider value={matomoTracker}>
        <BrowserRouter>
          <Switch>
            <Route path="/:lng" component={App} />
          </Switch>
        </BrowserRouter>
      </MatomoContext.Provider>
    );
  }

  return (
    <Switch>
      <Route path="/:lng" component={App} />
    </Switch>
  );
}

// eslint-disable-next-line max-len
export default withStyles(
  styles,
  appStyles,
  SMFonts,
  HSLFonts,
  printCSS,
  hdsStyle
)(LanguageWrapper);

// Typechecking
App.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
