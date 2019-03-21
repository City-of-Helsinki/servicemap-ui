const isClient = () => typeof window !== 'undefined';

const tAttr = (attr) => {
  let lang; let
    len;

  if (!attr) {
    return attr;
  }

  if (!(attr instanceof Object)) {
    console.error("translated attribute didn't get a translation object", attr);
    return attr;
  }

  // Try primary choice first, fallback to whatever's available.
  const languages = [].concat(SUPPORTED_LANGUAGES);

  for (let i = 0, len = languages.length; i < len; i++) {
    lang = languages[i];
    if (lang in attr) {
      return attr[lang];
    }
  }

  console.error('no supported languages found', attr);

  return null;
};

export const uppercaseFirst = val => val.charAt(0).toUpperCase() + val.slice(1);

export default isClient;
