import config from '../config';

const redirectables = [
  {
    check: /^\/(fi|sv|en)(|\/embed)\/unit\?(.+)=/,
    redirectTo: (item, req) => {
      try {
        let queryString = null;
        if (req.query) {
          queryString = Object.keys(req.query)
            .map((key) => `${key}=${req.query[key]}`)
            .join('&');
        }

        // Replace unit with search
        const pathArray = req.path.split('/');
        const index = pathArray.indexOf('unit');
        pathArray.splice(index, 1, 'search');
        const pathName = pathArray.join('/');

        return `${pathName}${queryString ? `?${queryString}` : ''}`;
      } catch (e) {
        return null;
      }
    },
  },
];

const isValidLanguage = (path) => {
  if (!path) {
    return false;
  }
  const hasLanguage = path.match(/^\/(fi|sv|en)/);
  return hasLanguage && hasLanguage.index === 0;
};
// Handle language change
export const makeLanguageHandler = (req, res, next) => {
  if (isValidLanguage(req.path)) {
    next();
    return;
  }
  res.redirect('/fi/');
};

// Redirect old language based domains to correct language
export const languageSubdomainRedirect = (req, res, next) => {
  if (!isValidLanguage(req.path) && req.subdomains.length === 1) {
    if (req.subdomains[0].match(/^servicemap/)) {
      const pathArray = req.url.split('/');
      pathArray.splice(1, 0, 'en');
      res.redirect(pathArray.join('/'));
      return;
    }
    if (req.subdomains[0].match(/^servicekarta/)) {
      const pathArray = req.url.split('/');
      pathArray.splice(1, 0, 'sv');
      res.redirect(pathArray.join('/'));
      return;
    }
    if (req.subdomains[0].match(/^palvelukartta/)) {
      const pathArray = req.url.split('/');
      pathArray.splice(1, 0, 'fi');
      res.redirect(pathArray.join('/'));
      return;
    }
  }
  next();
};

export const unitRedirect = (req, res, next) => {
  let redirecting = false;
  redirectables.forEach((item) => {
    if (redirecting) {
      return;
    }

    if (req.url.match(item.check)) {
      const redirectTo = item.redirectTo(item, req);
      if (redirectTo) {
        redirecting = true;
        res.redirect(redirectTo);
      }
    }
  });

  if (redirecting) {
    return;
  }

  next();
};

/**
 * Parse initial map position from environment variable
 * or use default position (Helsinki)
 * @param {*} req - express request
 * @param {*} Sentry - Sentry object for sending error logs to sentry
 */
export const parseInitialMapPositionFromHostname = (req, Sentry) => {
  let initialMapPosition =
    process.env.INITIAL_MAP_POSITION || '60.170377597530016,24.941309323934886';
  try {
    // Expecting DOMAIN_MAP_POSITIONS to be a string shaped like
    // hostname1,lat1,lon1;hostname2,lat2,lon2
    const domainMapPos = process.env.DOMAIN_MAP_POSITIONS;
    if (domainMapPos && req) {
      const host = req.hostname;
      const domainArray = domainMapPos.split(';');
      if (host && domainArray.length) {
        domainArray.forEach((h) => {
          const values = h.split(',');
          // Change initialMapPosition if request host is same as given host
          if (
            Array.isArray(values) &&
            values.length === 3 &&
            host === values[0]
          ) {
            initialMapPosition = `${values[1]},${values[2]}`;
          }
        });
      }
    }
  } catch (e) {
    if (Sentry && Sentry.captureException) {
      Sentry.captureException(e);
    }
    console.log(
      'Error while handling parseInitialMapPositionFromHostname. Returning default value:',
      initialMapPosition
    );
  }
  return initialMapPosition;
};

export const getRequestFullUrl = (req) =>
  `${req.protocol}://${req.get('host')}${req.originalUrl}`;

export const sitemapActive = () =>
  config.production &&
  process.env.DOMAIN &&
  process.env.NODE_ENV === 'production' &&
  process.env.SERVER_TYPE === 'production';
