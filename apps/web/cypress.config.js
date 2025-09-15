const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'zad925',
  env: {
    FAIL_FAST_STRATEGY: 'run',
    FAIL_FAST_ENABLED: true,
  },
  pageLoadTimeout: 30000,
  defaultCommandTimeout: 30000,
  chromeWebSecurity: false,
  viewportWidth: 1280,
  viewportHeight: 1500,
  video: false,
  waitForAnimations: true,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3000',
    specPattern: [
      'cypress/e2e/1-login/*.ts',
      'cypress/e2e/2-applicants/*.ts',
      'cypress/e2e/3-details/*.ts',
      'cypress/e2e/4-reports/*.ts',
      'cypress/e2e/5-user-management/*.ts',
      'cypress/e2e/6-ha/*.ts',
      'cypress/e2e/7-admin/*.ts',
    ],
  },
});
