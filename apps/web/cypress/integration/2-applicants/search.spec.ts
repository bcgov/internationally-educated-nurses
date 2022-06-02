/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Applicants - search', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('searches applicants in search bar', () => {
    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.searchApplicants(applicant.name);
    });
  });
});
