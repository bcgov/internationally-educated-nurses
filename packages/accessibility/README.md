# Accessibility

This package handles automated accessibility using the [axe test runner](https://github.com/pa11y/pa11y-runner-axe) testing for `@ien/web`.

Run tests with `yarn accessibility-test` from this directory or with `yarn workspace @ien/accessibility accessibility-test` from the root directory.

Screenshots will be output into `/screenCaptures` for each tested page.

## Chrome extension

`Pull request checks` run this accessibility test. If you want to debug or verify on your browser while developing, use [axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd).
