const defaults = {
  timeout: 30000,
  standard: 'WCAG2AA',
  runners: ['axe'],
  viewport: {
    width: 1300,
    height: 2400,
  },
};

const screenCap = fileName => `screen capture screenCaptures/${fileName}.png`;

const urls = [
  {
    url: 'http://localhost:3000/submission/1',
    actions: [screenCap('screencap_personal')],
  },
  {
    url: 'http://localhost:3000/submission/2',
    actions: [screenCap('screencap_contact')],
  },
  {
    url: 'http://localhost:3000/submission/3',
    actions: [screenCap('screencap_credential')],
  },
  {
    url: 'http://localhost:3000/submission/4',
    actions: [screenCap('screencap_preferences')],
  },
  {
    url: 'http://localhost:3000/submission/5',
    actions: [screenCap('screencap_review')],
  },
  {
    url: 'http://localhost:3000/confirmation?id=12345678910',
    actions: [screenCap('screencap_confirmation')],
  },
];

module.exports = {
  defaults,
  urls,
};
