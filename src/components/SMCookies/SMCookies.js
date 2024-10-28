import { CookieModal } from 'hds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { setTracker } from '../../redux/actions/tracker';
import { selectTracker } from '../../redux/selectors/general';
import { getLocale } from '../../redux/selectors/user';
import { COOKIE_MODAL_ROOT_ID } from '../../utils/constants';
import { isEmbed } from '../../utils/path';
import { getMatomoTracker } from '../../utils/tracking';
import featureFlags from '../../../config/featureFlags';

function SMCookies() {
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const tracker = useSelector(selectTracker);
  const dispatch = useDispatch();
  const cookieDomain = typeof window !== 'undefined' ? window.location.hostname : undefined;
  const embed = isEmbed();

  if (embed || !featureFlags.smCookies) {
    // No cookie modal or tracking in embed mode
    return null;
  }

  function parseConsentsAndActOnThem(consents) {
    if (!tracker && consents.matomo) {
      const matomoTracker = getMatomoTracker();
      if (matomoTracker) {
        dispatch(setTracker(matomoTracker));
      }
    }
  }

  const contentSource = {
    siteName: intl.formatMessage({ id: 'app.title' }),
    currentLanguage: locale,
    optionalCookies: {
      groups: [
        {
          commonGroup: 'statistics',
          cookies: [
            {
              id: 'matomo',
              name: '_pk*',
              hostName: 'digia.fi',
              description: intl.formatMessage({ id: 'cookies.matomo.description' }),
              expiration: intl.formatMessage({ id: 'cookies.matomo.expiration' }, { days: 393 }),
            },
          ],
        },
      ],
    },
    focusTargetSelector: '#app',
    onAllConsentsGiven: consents => parseConsentsAndActOnThem(consents),
    onConsentsParsed: consents => parseConsentsAndActOnThem(consents),
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
