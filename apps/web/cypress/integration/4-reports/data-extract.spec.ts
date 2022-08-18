/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Data Extract', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Reporting', { timeout: 60000 }).click();
  });

  it('downloads applicant data extract', () => {
    cy.get('input').should('have.class', 'bg-bcGrayInput');
    cy.get('#from').focus().type('2022-04-28{enter}');
    cy.get('#to').focus().type('2022-05-25{enter}');

    cy.contains('button.bg-bcBluePrimary', 'Download').eq(0).click();
    cy.verifyDownload('.xlsx', { contains: true });

    cy.task('checkDataExtract');
  });
});
