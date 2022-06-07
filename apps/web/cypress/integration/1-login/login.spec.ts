/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Login page', () => {
  beforeEach(() => {
    cy.login();
  });

  it('login with admin user account', () => {
    cy.visit('/');
    cy.contains('You have logged into IEN');
  });

  it('login with hmbc user account', () => {
    cy.visit('/');
    cy.login('ien_e2e_hmbc');
    cy.contains('You have logged into IEN');
  });

  it('login with hmbc user account', () => {
    cy.visit('/');
    cy.login('ien_e2e_hmbc');
    cy.contains('You have logged into IEN');
    cy.task('db:seed');
  });
});
