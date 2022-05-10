/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Log out', () => {
  beforeEach(() => {
    cy.visit('/');
    if (Cypress.config('isInteractive')) {
      cy.login();
    }
  });

  it('log out', () => {
    cy.get('button').contains(Cypress.env('username'), { timeout: 60000 }).click();
    cy.get('button').contains('Logout').click();
    cy.contains('Login');
  });
});
