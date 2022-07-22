/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Read-only access to Applicant', () => {
  it('hides add/edit buttons for users with read-only access to applicants', () => {
    cy.login('ien_e2e_view');
    cy.visit('/');
    cy.contains('button', 'Add Applicant').should('not.exist');
    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.visitDetails(applicant);
      cy.tabRecruitment();
      cy.contains('button', 'Add Record').should('not.exist');
      cy.get('[data-cy=record-0]').click();
      cy.contains('button', 'Edit Details').should('not.exist');
      cy.get('img[alt="edit milestone"]').should('not.exist');
      cy.get('img[alt="delete milestone"]').should('not.exist');
    });
  });
});
