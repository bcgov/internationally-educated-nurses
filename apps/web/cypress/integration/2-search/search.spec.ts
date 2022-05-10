/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Search User', () => {
  beforeEach(() => {
    cy.visit('/');
    if (Cypress.config('isInteractive')) {
      cy.login();
    }
  });
  it('searches user in search bar', () => {
    cy.search('Neoma');
  });
});
