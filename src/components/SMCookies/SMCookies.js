import { CookieModal } from 'hds-react';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { getLocale } from '../../redux/selectors/locale';

function SMCookies() {
  const intl = useIntl();
  const locale = useSelector(getLocale);
  const [language, setLanguage] = useState(locale);
  const onLanguageChange = newLang => setLanguage(newLang);
  const contentSource = {
    siteName: intl.formatMessage({ id: 'app.title' }),
    currentLanguage: language,
    optionalCookies: {
      cookies: [
        {
          commonGroup: 'statistics',
          commonCookie: 'matomo',
        },
      ],
    },
    language: {
      onLanguageChange,
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
