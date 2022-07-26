/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Health Authority', () => {
  it('adds a new applicant', () => {
    cy.login('ien_fha');
    cy.visit('/');

    // less than 60 applicants belong to ien_ha's authority
    cy.contains('of 6 pages');

    cy.contains('button', 'Add Applicant').click();
    cy.fixture('ha-user.json').then(({ applicant }) => {
      cy.addApplicant(applicant);
    });
  });

  it(' filters out applicant of other authorities', () => {
    cy.login('ien_fha');
    cy.visit('/');
    cy.searchApplicants('Trudie', false); // Trudie Grimes belongs to Northern Health Authority
  });

  it('allows users in the same authority to view applicants', () => {
    cy.login('ien_viha');
    cy.visit('/');
    cy.fixture('ha-user.json').then(({ applicant }) => {
      cy.searchApplicants(applicant.name);
    });
  });

  it('filters out users of other authorities', () => {
    cy.login('ien_fha');
    cy.visitUserManagement();
    cy.get('tbody > tr').should('have.length', 1);
  });
});
