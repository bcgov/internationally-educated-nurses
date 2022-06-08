/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  before(() => {
    cy.login();
  });

  it('login with user account', () => {
    cy.visit('/');
    cy.contains('You have logged into IEN');
    cy.task('db:seed');
    cy.logout();
  });
});
