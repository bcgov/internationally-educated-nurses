/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Data Extract', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.contains('a', 'Reporting').click();
  });

  it('downloads applicant data extract', () => {
    cy.get('input').should('have.class', 'bg-bcGrayInput');
    cy.get('input').eq(0).type('2022-04-28');
    cy.get('input').eq(1).type('2022-05-25');

    cy.contains('button.bg-bcBluePrimary', 'Download').eq(0).click();
    cy.verifyDownload('.xlsx', { contains: true });

    cy.task('checkDataExtract');
  });
});
