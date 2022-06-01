/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.ts can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

import dotenv from 'dotenv';
import * as path from 'path';
import { spawn } from 'child_process';
import { isFileExist, findFiles } from 'cy-verify-downloads';
import * as fs from 'fs';
import { readFile } from 'xlsx';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

/**
 * @param on
 * @param config
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars,
// @typescript-eslint/no-unused-vars

const execute = (task: string, script: string, ...args: string[]): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const p = spawn('bash', [script, ...args]);
    p.stdout.on('data', data => {
      // eslint-disable-next-line no-console
      console.log(`${task} stdout: ${data}`);
    });

    p.stderr.on('data', data => {
      // eslint-disable-next-line no-console
      console.log(`${task} stderr: ${data}`);
    });

    p.on('close', code => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(`${task} child process exited with code ${code}`);
      }
    });
  });
};

module.exports = (on: any, config: any) => {
  // `on` is used to hook into various events Cypress emits
  on('task', {
    'db:seed': async () => {
      return execute('db:seed', 'cypress/fixtures/seed.sh');
    },
    checkReport: (): boolean => {
      const files = fs.readdirSync(config.downloadsFolder);
      if (!files?.length) {
        throw Error('no files downloaded.');
      }
      files.forEach(name => {
        if (!name.endsWith('.xlsx')) return;

        const wb = readFile(path.join(config.downloadsFolder, name));
        const sheetNames = ['Report 1', 'Report 2'];
        sheetNames.forEach(sheet => {
          if (!wb.Sheets[sheet]) {
            throw Error(`${name} doesn't have ${sheet} sheet`);
          }
        });
      });
      return true;
    },
    isFileExist,
    findFiles,
  });

  // `config` is the resolved Cypress config
  config.env.username = process.env.E2E_TEST_USERNAME;
  config.env.password = process.env.E2E_TEST_PASSWORD;
  config.env.realm = process.env.AUTH_REALM;
  return config;
};
