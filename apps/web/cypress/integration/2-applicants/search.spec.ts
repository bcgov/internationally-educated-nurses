/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Applicants - search', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('searches applicants in search bar', () => {
    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.search(applicant.name);
    });
  });
});
