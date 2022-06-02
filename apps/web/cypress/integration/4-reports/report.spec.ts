/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Report', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  beforeEach(() => {
    cy.contains('a', 'Reporting').click();
  });

  after(() => {
    cy.logout();
  });

  it('lists report periods', () => {
    cy.contains('h1', 'Reporting');
    cy.get('tbody').find('tr').should('have.length', 10);
  });

  it('downloads a report', () => {
    cy.contains('button', 'Download').eq(0).click();
    cy.verifyDownload('.xlsx', { contains: true });
    cy.task('checkReport');
  });
});
