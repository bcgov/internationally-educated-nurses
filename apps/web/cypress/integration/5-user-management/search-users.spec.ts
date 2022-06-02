/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Applicants - search', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('searches applicants in search bar', () => {
    cy.contains('User Management');
    cy.userManagement();
    cy.get('h4').should('have.text', 'Manage user access and user roles');

    cy.searchUsers('test');
  });
});
