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

import { css, Global } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material';
// To add css variables for hds components
import hdsStyle from 'hds-design-tokens';
import withStyles from 'isomorphic-style-loader/withStyles';
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { IntlProvider, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { RouterProvider, useLocation } from 'react-router-dom';

import config from '../config';
import appStyles from './App.css';
import ogImage from './assets/images/servicemap-meta-img.png';
import { DataFetcher, Navigator } from './components';
import useMatomo from './components/Matomo/hooks/useMatomo';
import MatomoContext from './components/Matomo/matomo-context';
import MatomoTracker from './components/Matomo/MatomoTracker';
import SMCookies from './components/SMCookies/SMCookies';
import HSLFonts from './hsl-icons.css';
import styles from './index.css';
import DefaultLayout from './layouts/DefaultLayout';
import printCSS from './print.css';
import { selectMobility, selectSenses } from './redux/selectors/settings';
import { getLocale } from './redux/selectors/user';
import { createRouter } from './router';
import SMFonts from './service-map-icons.css';
import ThemeWrapper from './themes/ThemeWrapper';
import isClient from './utils';
import { COOKIE_MODAL_ROOT_ID } from './utils/constants';
import useMobileStatus from './utils/isMobile';
import LocaleUtility from './utils/locale';
import { isEmbed } from './utils/path';
import { servicemapTrackPageView } from './utils/tracking';

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

function App({ component: Component }) {
  const locale = useSelector(getLocale);
  const intlData = LocaleUtility.intlData(locale);
  const { trackPageView } = useMatomo();
  const location = useLocation();
  const senses = useSelector(selectSenses);
  const mobility = useSelector(selectMobility);

  // Remove the server-side injected CSS.
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  const isMobile = useMobileStatus();
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

  return (
    <StyledEngineProvider>
      <Global
        styles={css({
          // hide language selector in hds cookie modal
          '#cookie-consent-language-selector-button': {
            display: 'none',
          },
          ...(isMobile && {
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
            {Component ? <Component /> : <DefaultLayout />}
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

  // Only create router on client side
  if (isClient()) {
    const router = createRouter(App);
    return (
      <MatomoContext.Provider value={matomoTracker}>
        <RouterProvider router={router} />
      </MatomoContext.Provider>
    );
  }

  return (
    <MatomoContext.Provider value={matomoTracker}>
      <App />
    </MatomoContext.Provider>
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
