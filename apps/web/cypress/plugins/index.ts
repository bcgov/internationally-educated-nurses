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
import { isFileExist, findFiles } from 'cy-verify-downloads';
import * as fs from 'fs';
import { readFile } from 'xlsx-js-style';

dotenv.config({ path: path.join(__dirname, '../../.env.local') });

/**
 * @param on
 * @param config
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars,
// @typescript-eslint/no-unused-vars

module.exports = (on: any, config: any) => {
  // `on` is used to hook into various events Cypress emits
  on('task', {
    checkReport: (): boolean => {
      const files = fs.readdirSync(config.downloadsFolder);
      if (!files?.length) {
        throw Error('no files downloaded.');
      }

      files
        .filter(f => f.includes('ien-report-period'))
        .forEach(name => {
          if (!name.endsWith('.xlsx')) return;

          const wb = readFile(path.join(config.downloadsFolder, name));
          const indices = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          indices.forEach(index => {
            const sheetName = `Report ${index}`;
            if (!wb.Sheets[sheetName]) {
              throw Error(`${name} doesn't have ${sheetName} sheet`);
            }
          });
        });
      return true;
    },
    checkDataExtract({ fileName, sheetNames }: { fileName: string; sheetNames: string[] }) {
      const wb = readFile(path.join(config.downloadsFolder, fileName));

      sheetNames.forEach(sheetName => {
        if (!wb.Sheets[sheetName]) {
          throw Error(`${name} doesn't have ${sheetName} sheet`);
        }
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
