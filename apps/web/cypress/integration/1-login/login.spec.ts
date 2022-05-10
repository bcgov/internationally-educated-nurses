/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('login with user account', () => {
    cy.login();
    cy.task('db:seed');
  });
});
