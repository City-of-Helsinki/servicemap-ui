import { useSelector } from 'react-redux';

import config from '../../config';
import { getLocale } from '../redux/selectors/user';
import siteSettings from './siteSettings.json';

// import { PAGE_HEADER_ID } from '../common/constants';

const useCookieConsentSettings = () => {
  //const { i18n } = useTranslation();
  // const intl = useIntl();
  //const currentLanguage = getLanguageCode(i18n.language);
  const locale = useSelector(getLocale);

  const cookieConsentProps = {
    onChange: (changeEvent) => {
      const { acceptedGroups } = changeEvent;

      const hasStatisticsConsent = acceptedGroups.indexOf('statistics') > -1;
      if (window._paq) {
        console.log(' kookies cnsent');

        if (hasStatisticsConsent) {
          // never enable tracking in non-prod
          if (config.matomoEnabled === 'true') {
            return;
          }
          //  start tracking
          window._paq.push(['setConsentGiven']);
          window._paq.push(['setCookieConsentGiven']);
        } else {
          // tell matomo to forget conset
          window._paq.push(['forgetConsentGiven']);
        }
      }
    },
    siteSettings,
    options: {
      focusTargetSelector: `#app-title`, // focusTargetSelector: `#${PAGE_HEADER_ID}`, app-title
      language: locale,
    },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
