const defaults = {
  timeout: 30000,
  standard: 'WCAG2AA',
  runners: ['axe'],
  viewport: {
    width: 1300,
    height: 1200,
  },
};

const log = {
  debug: console.log,
  error: console.error,
  info: console.log,
};

const loginActions = [
  'wait for path to be /login',
  'screen capture captures/login.png',
  'click element button',
  'wait for element #username to be visible',
  'screen capture captures/login1.png',
  `set field #username to ${process.env.E2E_TEST_USERNAME}`,
  'screen capture captures/login2.png',
  `set field #password to ${process.env.E2E_TEST_PASSWORD}`,
  'screen capture captures/login3.png',
  'click element #kc-login',
  'wait for url to be http://localhost:3000/applicants',
  'wait for element table to be visible',
  'wait for element .animate-spin to be removed',
];

const urls = [
  {
    url: 'http://localhost:3000',
    actions: [...loginActions],
    hideElements: 'div[class*="opacity-50"]',
    log,
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'click element #details-0',
      'wait for path to be /details',
      'wait for element .animate-spin to be removed',
      'screen capture captures/details.png',
    ],
    hideElements: 'div[class*="opacity-50"], div[class*="placeholder"]',
    log,
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'click element #details-0',
      'wait for path to be /details',
      'wait for element .animate-spin to be removed',
      'screen capture captures/job0.png',
      'wait for element button[id="3"] to be visible',
      'click element button[id="3"]',
      'wait for element button[class*="bg-bcBlueBar"] to be visible',
      'click element button[class*="bg-bcBlueBar"]',
      'screen capture captures/job0.png',
      'wait for element form to be visible',
      'screen capture captures/job.png',
    ],
    hideElements: 'div[class*="opacity-50"], div[class*="placeholder"]',
    wait: 1000,
    log,
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'navigate to http://localhost:3000/reporting',
      'wait for element .animate-spin to be removed',
      'screen capture captures/reporting.png',
    ],
    hideElements: 'div[class*="opacity-50"]',
    log,
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'navigate to http://localhost:3000/user-management',
      'wait for element .animate-spin to be removed',
      'screen capture captures/user-management.png',
    ],
    hideElements: 'div[class*="opacity-50"], div[class*="placeholder"]',
    log,
  },
];

module.exports = {
  defaults,
  urls,
};
