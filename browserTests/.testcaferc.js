module.exports = {
  browsers: ["firefox:headless"], // Browsers to run tests on
  skipJsErrors: true, // Ignores JavaScript errors
  quarantineMode: {
    successThreshold: 1,
    attemptLimit: 10
  },
}
