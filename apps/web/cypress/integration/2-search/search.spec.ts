/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Search Applicants', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('searches applicants in search bar', () => {
    cy.search('Neoma');
  });
});
