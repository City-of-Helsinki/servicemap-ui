const config = require('./config');
const testcafe = require('testcafe');
const { server } = config;

async function setCookies(t) {
  await t.setNativeDialogHandler(null);
  const afterOneYear = new Date();
  afterOneYear.setDate(afterOneYear.getDate() + 365);
  const url = await testcafe.ClientFunction(() => document.location.href)();
  await t.setCookies({
    name: 'city-of-helsinki-cookie-consents',
    // value: '{"city-of-helsinki-cookie-consents":true,"matomo":false}',
    value: '%7B%22city-of-helsinki-cookie-consents%22%3Atrue%2C%22matomo%22%3Atrue%7D',
    domain: `${server.address}`,
    path: '/',
    expires: afterOneYear,
    maxAge: 365 * 24 * 60 * 60,
    secure: false,
    httpOnly: false,
    sameSite: 'Strict',
  })
    .navigateTo(url);
}

module.exports = {
  hooks: {
    test: {
      before: async t => {
        await setCookies(t);
      },
      after: async () => {
      },
    },
  },
}
