/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import dayjs from "dayjs";

describe('Report', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Reporting', { timeout: 60000 }).click();
  });

  it('lists report periods', () => {
    cy.contains('h1', 'Reporting');
    cy.get('tbody').find('tr').should('have.length',(dayjs().diff('2022-05-02','day')/28)+1);
  });

  it('downloads a report', () => {
    cy.contains('button.bg-white', 'Download').eq(0).click();
    cy.verifyDownload('.xlsx', { contains: true });
    cy.task('checkReport');
  });
});
