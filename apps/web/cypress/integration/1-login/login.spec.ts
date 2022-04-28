/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  it('login with user account', () => {
    cy.visit('/');
    cy.login();
  });
});
