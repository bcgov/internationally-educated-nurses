/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

describe('Applicants - search', () => {
  before(() => {
    cy.login();
    cy.visit('/');
  });

  it('searches applicants in search bar', () => {
    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.searchApplicants(applicant.name);
    });
  });
});
