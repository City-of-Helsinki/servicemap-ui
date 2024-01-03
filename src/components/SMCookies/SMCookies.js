import { CookieModal } from 'hds-react';
import React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import setTracker from '../../redux/actions/tracker';
import { selectTracker } from '../../redux/selectors/general';
import { getLocale } from '../../redux/selectors/locale';
import { COOKIE_MODAL_ROOT_ID } from '../../utils/constants';
import { getMatomoTracker } from '../../utils/tracking';

function SMCookies() {
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const tracker = useSelector(selectTracker);
  const dispatch = useDispatch();
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
    onAllConsentsGiven: consents => {
      if (!tracker && consents.matomo) {
        dispatch(setTracker(getMatomoTracker()));
      }
    },
    onConsentsParsed: consents => {
      if (!tracker && consents.matomo) {
        dispatch(setTracker(getMatomoTracker()));
      }
    },
  };
  return <CookieModal contentSource={contentSource} rootId={COOKIE_MODAL_ROOT_ID} />;
}

export default SMCookies;
