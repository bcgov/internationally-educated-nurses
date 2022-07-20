/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Health Authority', () => {
  beforeEach(() => {
    cy.login('ien_ha');
  });

  it('adds a new applicant', () => {
    cy.visit('/');

    // less than 60 applicants belong to ien_ha's authority
    cy.contains('of 6 pages');

    cy.contains('button', 'Add Applicant').click();
    cy.fixture('ha-user.json').then(({ applicant }) => {
      cy.addApplicant(applicant);
    });
  });

  it(' filters out applicant of other authorities', () => {
    cy.visit('/');
    cy.searchApplicants('Trudie', false); // Trudie Grimes belongs to Northern Health Authority
  });

  it('filters out users of other authorities', () => {
    cy.visitUserManagement();
    cy.get('tbody > tr').should('have.length', 1);
  });
});
