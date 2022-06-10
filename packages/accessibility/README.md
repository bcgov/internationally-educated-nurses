# Accessibility

This package handles automated accessibility(a11y) using the [axe test runner](https://github.com/pa11y/pa11y-runner-axe) testing for `@ien/web`.

Tests run with standard of **WCAG2AA**.

## Preparation

The a11y tests should be executed on every page. It means that the application should be running with enough data, which enables every page to render their components correctly.

## Authentication

The application requires authentication. pa11y uses these actions to pass the login process.

See [pa11y-ci.js](./src/pa11y-ci.js)

```
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
```

Note that two environment variables, E2E_TEST_USERNAME and E2E_TEST_PASSWORD, should be defined for logging in. 

## Run with the running application

If the application is running locally, run `make test-pa11y`. Make sure that .env has username and password variables. 

Note that `yarn test:pa11y` command doesn't pick the variables from .env, and they should be set manually in advance. 

## Run in the CI process

Testing env including database is ephemeral and should be reinitialized every time. Our approach is to run a11y tests after cypress has prepared minimal data through its test suites. `make test-web` starts clean test database, runs cypress and pa11y tests, and destroys the database before termination.

See [Makefile](../../Makefile)

```makefile
test-web:
	@make start-test-db
	@yarn build
	@NODE_ENV=test yarn test:web:all
	@make stop-test-db
```
`yarn test:web:all` executes `start-test 'start:local' http://localhost:3000 'test:web'`.

`start-test` command is from [start-server-and-test](https://www.npmjs.com/package/start-server-and-test). It executes `yarn start:local`, waits for `http://localhost:3000` to be accessible, and then executes `yarn test:web`.

`test:web` executes `yarn start:cypress && yarn test:pa11y` so that `test:pa11y` could run only when `start:cypress` succeeds.

## Processing test results and notification

`test:pa11y` command redirects outputs to accessibility_results.json.
If there is an error, [pr-check-e2e](../../.github/workflows/pr-check-e2e.yml) runs [generate-a11y-markdown.js](./src/generate-a11y-markdown.js) to process the output and create a comment on the pull request. 

## Debugging

To debug with verbose outputs instead of redirecting them to a file, run `make debug-pa11y`.

## Screenshots

`screen capture` saves screenshots into `/captures` folder. Each test case takes a screenshot before assessing a11y.

## Exceptions

`hideElements: 'div[class*="placeholder"]'`

pa11y reports low contrast for default placeholder's text. Changing color or opacity doesn't resolve it.

## Chrome extension

If you want to debug or verify on your browser while developing, use [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd).
