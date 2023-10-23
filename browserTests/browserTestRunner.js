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
        'browserTests/generic/browserTest.js',
        'browserTests/generic/generalTest.js',
        'browserTests/generic/mapTest.js',
        'browserTests/generic/navigationTest.js',
        'browserTests/views/addressTest.js',
        'browserTests/views/areaTest.js',
        'browserTests/views/embeddedViewsTest.js',
        'browserTests/views/homeTest.js',
        'browserTests/views/mobilityTreeTest.js',
        'browserTests/views/searchTest.js',
        'browserTests/views/serviceTest.js',
        'browserTests/views/serviceTreeTest.js',
        'browserTests/views/settingsTest.js',
        'browserTests/views/unitPageExtendedDataTest.js',
        'browserTests/views/unitPageTest.js',
      ])
      .browsers(['chrome:headless'])
      // .reporter('list')
      .run({
        disableNativeAutomation: true,
      });
  })
  .then((failedCount) => {
    console.log(`Tests failed: ${failedCount}`);
    testcafe.close();
  });
