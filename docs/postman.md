# Postman pre-request script 

This script authenticates and saves a token before executing any queries.

1. Copy and paste contents of the function into IEN collection's pre-request tab.
2. Define the environment variables: AUTH_URL, AUTH_REALM, AUTH_CLIENT_ID, username, and password.

```javascript
const username = pm.environment.get('username');
const password = pm.environment.get('password');
if (!username || !password) return;

const authUrl = pm.environment.get('AUTH_URL');
const realm = pm.environment.get('AUTH_REALM');
const clientId = pm.environment.get('AUTH_CLIENT_ID');

const url = `${authUrl}/realms/${realm}/protocol/openid-connect/token`;

if (!username) return;

let tokenDate = new Date(2010, 1, 1);
let tokenTimestamp = pm.environment.get('auth_timestamp');
if (tokenTimestamp) {
tokenDate = Date.parse(tokenTimestamp);
}

let expiresInTime = pm.environment.get('expires_in');
if (!expiresInTime) {
expiresInTime = 120000; // Set default expiration time to 2 minutes
}

const timePassed = new Date() - tokenDate;
if (timePassed >= expiresInTime) {
const refreshExpiresInTime = pm.environment.get('refresh_expires_in');
const refreshToken = pm.environment.get('refresh_token');

const form = [];
if ((timePassed < refreshExpiresInTime || !refreshExpiresInTime) && refreshToken) {
  form.push(`grant_type=${encodeURIComponent('refresh_token')}`);
  form.push(`client_id=${encodeURIComponent(clientId)}`);
  form.push(`refresh_token=${encodeURIComponent(refreshToken)}`);
} else {
  form.push(`grant_type=${encodeURIComponent('password')}`);
  form.push(`client_id=${encodeURIComponent(clientId)}`);
  form.push(`username=${encodeURIComponent(username)}`);
  form.push(`password=${encodeURIComponent(password)}`);
}

pm.sendRequest(
  {
    url,
    method: 'POST',
    header: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      mode: 'raw',
      raw: form.join('&'),
    },
  },
  function (err, res) {
    if (res.code === 200) {
      pm.environment.set('auth_timestamp', new Date());
      pm.environment.set('token', res.json().access_token);
      pm.environment.set('refresh_token', res.json().refresh_token);
      pm.environment.set('expires_in', res.json().expires_in * 1000);
      pm.environment.set('refresh_expires_in', res.json().refresh_expires_in * 1000);
    } else {
      pm.environment.set('expires_in', '');
      pm.environment.set('refresh_expires_in', '');
      pm.environment.set('token', '');
      pm.environment.set('refresh_token', '');
    }
  },
);
}
```
