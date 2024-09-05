function getFormattedDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
  var day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function handler(event) {
  var response = event.response;
  var headers = response.headers;
  // Generate a nonce value
  var nonce = getFormattedDate();

  // Set HTTP security headers
  // Since JavaScript doesn't allow for hyphens in variable names, we use the dict["key"] notation
  headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubdomains; preload' };
  headers['content-security-policy'] = {
    // Removed the script-src from the value
    value:
      "default-src 'self' https://keycloak.freshworks.club https://common-logon-dev.hlth.gov.bc.ca https://common-logon-test.hlth.gov.bc.ca https://common-logon.hlth.gov.bc.ca https://ien-dev-reports.s3.ca-central-1.amazonaws.com https://ien-test-reports.s3.ca-central-1.amazonaws.com https://ien-prod-reports.s3.ca-central-1.amazonaws.com; img-src 'self'; style-src 'self' 'nonce-" +
      nonce +
      "';" +
      "form-action 'self'; frame-ancestors 'self'",
  };
  headers['x-content-type-options'] = { value: 'nosniff' };
  headers['x-frame-options'] = { value: 'DENY' };
  headers['x-xss-protection'] = { value: '1; mode=block' };
  headers['x-download-options'] = { value: 'noopen' };
  headers['server'] = { value: '*' };
  headers['cache-control'] = { value: 'no-store' };

  headers['permissions-policy'] = {
    // reference from https://github.com/bcgov/platform-services-registry/blob/bd134f7f7ce460a23d9212bd612ca336a8ba2f8c/next.config.js
    // extended from See https://developer.mozilla.org/en-US/docs/Web/HTTP/Permissions_Policy
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
    // Removed experimental features to get rid of console warnings like "Error with Permissions-Policy header: Unrecognized feature: 'ambient-light-sensor'."
    value: [
      'accelerometer=()',
      'autoplay=()',
      'bluetooth=()',
      'browsing-topics=()',
      'camera=()',
      'cross-origin-isolated=()',
      'display-capture=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'gamepad=()',
      'geolocation=()',
      'gyroscope=()',
      'hid=()',
      'identity-credentials-get=()',
      'idle-detection=()',
      'keyboard-map=()',
      'local-fonts=()',
      'magnetometer=()',
      'microphone=()',
      'midi=()',
      'otp-credentials=()',
      'payment=()',
      'picture-in-picture=()',
      'publickey-credentials-create=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'serial=()',
      'storage-access=()', // restricted for third-party context (iframe)
      'sync-xhr=()',
      'usb=()',
      'web-share=()',
      'window-management=()',
      'xr-spatial-tracking=()',
    ].join(','),
  };

  // Return the response to viewers
  return response;
}
