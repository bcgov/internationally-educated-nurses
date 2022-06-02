/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Applicants - search', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('searches applicants in search bar', () => {
    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.search(applicant.name);
    });
  });
});
