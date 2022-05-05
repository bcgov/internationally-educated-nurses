/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Log out', () => {
  it('log out', () => {
    cy.visit('/');
    // cy.login();
    cy.get('button').contains(Cypress.env('username'), { timeout: 60000 }).click();
    cy.get('button').contains('Logout').click();
    cy.contains('Login');
  });
});
