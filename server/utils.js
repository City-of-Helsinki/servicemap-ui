const isValidLanguage = (path) => {
  if(!path) {
    return false;
  }
  const hasLanguage = path.match(/^\/(fi|se|en)/);
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
