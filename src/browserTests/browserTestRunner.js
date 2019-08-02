const createTestCafe = require('testcafe');

let testcafe = null;

createTestCafe('localhost')
  .then((tc) => {
    testcafe = tc;
    const runner = testcafe.createRunner();

    return runner
      .src([
        'src/browserTests/browserTest.js',
        'src/browserTests/accessibilityTest.js',
        'src/browserTests/searchTest.js',
        'src/browserTests/titleBarTest.js',
        'src/browserTests/unitPageTest.js',
        'src/browserTests/unitListPageTest.js',
      ])
      .browsers(['chrome:headless'])
      // .reporter('list')
      .run();
  })
  .then((failedCount) => {
    console.log(`Tests failed: ${failedCount}`);
    testcafe.close();
  });
