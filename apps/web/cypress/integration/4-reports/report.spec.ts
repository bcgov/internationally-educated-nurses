/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Report', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Reporting').click();
  });

  it('lists report periods', () => {
    cy.contains('h1', 'Reporting');
    cy.get('tbody').find('tr').should('have.length', 10);
  });

  it('downloads a report', () => {
    cy.get('button:contains(Download)').eq(1).click();
    cy.verifyDownload('.xlsx', { contains: true });
    cy.task('checkReport');
  });
});
