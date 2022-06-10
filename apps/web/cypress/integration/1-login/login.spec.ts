/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  it('login with admin user account', () => {
    cy.login();
    cy.visit('/');
    cy.contains('You have logged into IEN', { timeout: 60000 });
  });

  it('login with hmbc user account', () => {
    cy.login('ien_e2e_hmbc');
    cy.task('db:seed');
  });
});
