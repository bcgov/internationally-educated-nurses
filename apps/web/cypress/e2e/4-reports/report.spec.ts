/// <reference types="cypress" />
/// <reference types="cy-verify-downloads" />
/// <reference path="../../support/e2e.ts"/>

import dayjs from 'dayjs';

describe('Report', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Reporting', { timeout: 60000 }).click();
  });

  /* As we have removed the period report table, the following test cases are no longer needed */

  // it('lists report periods', () => {
  //   cy.contains('h1', 'Reporting');
  //   cy.contains('span', 'of ' + Math.floor(dayjs().diff('2022-05-02', 'day') / 28 + 1) + ' items');
  // });

  // it('downloads a report', () => {
  //   cy.contains('button.bg-white', 'Download').eq(0).click();
  //   cy.verifyDownload('.xlsx', { contains: true });
  //   cy.task('checkReport');
  // });
});
