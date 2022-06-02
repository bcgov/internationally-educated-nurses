/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  after(() => {
    cy.logout();
  });

  it('login with user account', () => {
    cy.visit('/');
    cy.login();
    cy.contains('You have logged into IEN');
    cy.task('db:seed');
  });
});
