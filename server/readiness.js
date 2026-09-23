import { version } from '../package.json';

const getReadiness = (req, res) => {
  res.header('Content-Type', 'application/json');
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');

  res.json({
    status: 'ok',
    release: process.env.SENTRY_RELEASE,
    version,
  });
};

export default getReadiness;
