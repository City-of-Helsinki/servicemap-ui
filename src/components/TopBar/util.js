import config from '../../../config';

const openA11yLink = (locale) => {
  const a11yURLs = config.accessibilityStatementURL;
  const localeUrl =
    !a11yURLs[locale] || a11yURLs[locale] === 'undefined'
      ? null
      : a11yURLs[locale];
  window.open(localeUrl);
};

export default openA11yLink;
