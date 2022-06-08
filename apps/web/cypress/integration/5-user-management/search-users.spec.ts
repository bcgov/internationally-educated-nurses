/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Users - search', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('searches users in search bar', () => {
    cy.visitUserManagement();

    cy.searchUsers('ien');
  });
});
