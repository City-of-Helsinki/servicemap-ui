import { version } from '../package.json';

const getReadiness = (req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');

  res.json({
    status: 'ok',
    release: process.env.SENTRY_RELEASE,
    packageVersion: version,
  });
};

export default getReadiness;
