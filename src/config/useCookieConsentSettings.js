import { useSelector } from 'react-redux';

import config from '../../config';
import { getLocale } from '../redux/selectors/user';
import siteSettings from './siteSettings.json';


const useCookieConsentSettings = () => {

  const locale = useSelector(getLocale);

  const cookieConsentProps = {
    onChange: (changeEvent) => {
      const { acceptedGroups } = changeEvent;

      const hasStatisticsConsent = acceptedGroups.indexOf('statistics') > -1;
      if (window._paq) {
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
      focusTargetSelector: `#app-title`,
      language: locale,
    },
  };

  return cookieConsentProps;
};

export default useCookieConsentSettings;
