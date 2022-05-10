/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.logout();
  });

  it('login with user account', () => {
    cy.login();

    if (!Cypress.config('isInteractive')) {
      cy.contains('You have logged into IEN');
      cy.logout();
      cy.task('db:seed');
      cy.login();
    }
    cy.contains('Items per page:');
  });
});
