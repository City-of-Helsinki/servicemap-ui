/* eslint-disable no-underscore-dangle */
import { CookieModal } from 'hds-react';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getLocale } from '../../redux/selectors/user';
import { COOKIE_MODAL_ROOT_ID } from '../../utils/constants';
import { isEmbed } from '../../utils/path';
import featureFlags from '../../../config/featureFlags';

function SMCookies() {
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const cookieDomain = typeof window !== 'undefined' ? window.location.hostname : undefined;
  const embed = isEmbed();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (embed || !mounted || !featureFlags.smCookies) {
    // No cookie modal or tracking in embed mode
    return null;
  }

  function onAllConsentsGiven(consents) {
    if (window._paq) {
      if (consents.matomo) {
        //  start tracking
        window._paq.push(['rememberCookieConsentGiven']);
        window._paq.push(['rememberConsentGiven']);
      } else {
        // tell matomo to forget conset
        window._paq.push(['forgetCookieConsentGiven']);
        window._paq.push(['forgetConsentGiven']);
      }
    }
  }

  function onConsentsParsed(consents) {
    if (window._paq && consents.matomo === undefined) {
      // tell matomo to wait for consent:
      window._paq.push(['requireCookieConsent']);
    }
  }

  const contentSource = {
    siteName: intl.formatMessage({ id: 'app.title' }),
    currentLanguage: locale,
    optionalCookies: {
      groups: [
        {
          commonGroup: 'statistics',
          cookies: [{
            id: 'matomo',
            name: '_pk*',
            hostName: 'digia.fi',
            description: intl.formatMessage({ id: 'cookies.matomo.description' }),
            expiration: intl.formatMessage({ id: 'cookies.matomo.expiration' }, { days: 393 }),
          }],
        },
      ],
    },
    focusTargetSelector: '#app',
    onAllConsentsGiven,
    onConsentsParsed,
  };
  return (
    <CookieModal
      cookieDomain={cookieDomain}
      contentSource={contentSource}
      rootId={COOKIE_MODAL_ROOT_ID}
    />
  );
}

export default SMCookies;
