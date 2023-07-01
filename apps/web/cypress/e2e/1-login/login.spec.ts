/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

describe('Login page', () => {
  it('login with admin user account', () => {
    cy.login();
  });

  it('login with hmbc user account', () => {
    cy.login('ien_hmbc');
  });
});
