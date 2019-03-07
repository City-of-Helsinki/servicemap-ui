import I18n from '../src/i18n';

const allowedUrls = [
  /^\/.{2,}\/$/,
  /^\/.{2,}\/unit\/\d+$/,
  /^\/.{2,}\/unit$/,
  /^\/.{2,}\/search$/,
  /^\/.{2,}\/address\/[^\/]+\/[^\/]+\/[^\/]+$/,
  /^\/.{2,}\/division\/[^\/]+\/[^\/]+$/,
  /^\/.{2,}\/division$/,
  /^\/.{2,}\/area$/,
];

// Handle redirecting
export const handleRequestRedirect = (req, res) => {
  // Check if request url is actual path
  let match = false;
  allowedUrls.forEach((url) => {
    if (!match && req.path.match(url)) {
      match = true;
    }
  });

  // Handle language check and redirect if language is changed to default
  const i18n = new I18n();
  const pathArray = req.url.split('/');
  if (match && !i18n.isValidLocale(pathArray[1])) {
    pathArray[1] = i18n.locale;
    res.redirect(pathArray.join('/'));
    return true;
  }
  return false;
};