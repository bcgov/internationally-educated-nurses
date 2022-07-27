/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  it('login with admin user account', () => {
    cy.login();
  });

  it('login with hmbc user account', () => {
    cy.login('ien_hmbc');
  });
});
