#!/usr/bin/env node
/**
 * Generates a local-only Keycloak realm file from the committed realm export.
 *
 * keycloak/realm-ien.json ships hashed passwords whose plaintext lives in a GitHub
 * secret, so it cannot be used to log in locally. This script copies that export and
 * replaces every user's credentials with one plaintext password taken from the
 * KEYCLOAK_LOCAL_PASSWORD environment variable, writing the result to a gitignored
 * file that only docker-compose.local.yml mounts.
 *
 * The committed export is never modified, so the test stack and CI keep working.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'keycloak', 'realm-ien.json');
const TARGET = path.join(ROOT, 'keycloak', 'realm-ien.generated.json');

const password = process.env.KEYCLOAK_LOCAL_PASSWORD; // Developer to provide plaintext password freely for local Keycloak users only.

if (!password) {
  console.error(
    'KEYCLOAK_LOCAL_PASSWORD is not set.\n' +
      'Add it to your .env — see .config/.env-example for the default.',
  );
  process.exit(1);
}

const realm = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));

realm.users = (realm.users ?? []).map(user => ({
  ...user,
  credentials: [{ type: 'password', value: password, temporary: false }],
}));

// No banner comment inside the JSON: Keycloak rejects unknown top-level fields on
// import. The filename, .gitignore entry and docker-compose.local.yml comment carry
// the warning instead.
fs.writeFileSync(TARGET, JSON.stringify(realm, null, 2));

console.log(
  `Wrote ${path.relative(ROOT, TARGET)} - ${realm.users.length} users share the password from KEYCLOAK_LOCAL_PASSWORD.`,
);
