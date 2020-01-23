const redirectables = [
  {
    check: /^\/(fi|sv|en)\/embed\/unit\?(.+)=/,
    redirectTo: (item, req) => {
      try {
        let queryString = null;
        if (req.query) {
          queryString = Object.keys(req.query).map(key => `${key}=${req.query[key]}`).join('&');
        }

        // Replace unit with search
        const pathArray = req.path.split('/');
        const index = pathArray.indexOf('unit');
        pathArray.splice(index, 1, 'search');
        const pathName = pathArray.join('/');
  
        return pathName + `${queryString ? `?${queryString}` : ''}`;
      } catch (e) {
        return null;
      }
    },
  }
];

const isValidLanguage = (path) => {
  if(!path) {
    return false;
  }
  const hasLanguage = path.match(/^\/(fi|sv|en)/);
  return hasLanguage && hasLanguage.index === 0;
}
// Handle language change
export const makeLanguageHandler = (req, res, next) => {

  if(isValidLanguage(req.path)) {
    next();
    return;
  }
  res.redirect('/fi/');
  return;
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
      pathArray.splice(1, 0, 'se');
      res.redirect(pathArray.join('/'));
      return;
    }
  }
  next();
  return;
}

export const unitRedirect = (req, res, next) => {
  let redirecting = false;
  redirectables.forEach(item => {
    if(redirecting) {
      return;
    }

    if (req.url.match(item.check)) {
      const redirectTo = item.redirectTo(item, req);
      if (redirectTo) {
        redirecting = true;
        res.redirect(redirectTo);
        return;
      }
    }
  });

  if (redirecting) {
    return;
  }

  next();
  return;
}
