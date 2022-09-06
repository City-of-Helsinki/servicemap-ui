// TODO: Move to use CLI to run tests
const createTestCafe = require('testcafe');

let testcafe = null;

createTestCafe('localhost')
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src([
        'browserTests/generic/accessibilityTest.js',
        'browserTests/views/addressTest.js',
        'browserTests/views/areaTest.js',
        'browserTests/generic/browserTest.js',
        'browserTests/views/embedTest.js',
        'browserTests/generic/generalTest.js',
        'browserTests/views/searchTest.js',
        'browserTests/views/serviceTest.js',
        'browserTests/views/settingsTest.js',
        // 'browserTests/titleBarTest.js',
        'browserTests/views/unitPageTest.js',
        // 'browserTests/views/unitListPageTest.js',
      ])
      .browsers(['chrome:headless'])
      // .reporter('list')
      .run();
  })
  .then((failedCount) => {
    console.log(`Tests failed: ${failedCount}`);
    testcafe.close();
  });
