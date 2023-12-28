import { CookieModal } from 'hds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getLocale } from '../../redux/selectors/locale';

function SMCookies() {
  const intl = useIntl();
  const locale = useSelector(getLocale);
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
    focusTargetSelector: '[href="#view-title"]',
    onAllConsentsGiven: (consents) => {
      // called when consents are saved
      // handle changes like:
      if (!consents.matomo) {
        // stop matomo tracking
      }
    },
  };
  return <CookieModal contentSource={contentSource} />;
}

export default SMCookies;
