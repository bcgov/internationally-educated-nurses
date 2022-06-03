const defaults = {
  timeout: 30000,
  standard: 'WCAG2AA',
  runners: ['axe'],
  viewport: {
    width: 1300,
    height: 1200,
  },
};

const loginActions = [
  'wait for path to be /login',
  'screen capture screenshots/login.png',
  'click element button',
  'wait for element #username to be visible',
  'screen capture screenshots/login1.png',
  `set field #username to ${process.env.E2E_TEST_USERNAME}`,
  'screen capture screenshots/login2.png',
  `set field #password to ${process.env.E2E_TEST_PASSWORD}`,
  'screen capture screenshots/login3.png',
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
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'click element #details-0',
      'wait for path to be /details',
      'wait for element .animate-spin to be removed',
      'screen capture screenshots/details.png',
    ],
    hideElements: 'div[class*="opacity-50"], div[class*="placeholder"]',
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'click element #details-0',
      'wait for path to be /details',
      'wait for element .animate-spin to be removed',
      'click element button[class*="bg-bcBlueBar"]',
      'wait for element form to be visible',
      'screen capture screenshots/job.png',
    ],
    hideElements: 'div[class*="opacity-50"], div[class*="placeholder"]',
    wait: 2000,
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'navigate to http://localhost:3000/reporting',
      'wait for element .animate-spin to be removed',
      'screen capture screenshots/reporting.png',
    ],
    hideElements: 'div[class*="opacity-50"]',
  },
  {
    url: 'http://localhost:3000',
    actions: [
      ...loginActions,
      'navigate to http://localhost:3000/user-management',
      'wait for element .animate-spin to be removed',
      'screen capture screenshots/user-management.png',
    ],
    hideElements: 'div[class*="opacity-50"], div[class*="placeholder"]',
  },
];

module.exports = {
  defaults,
  urls,
};
