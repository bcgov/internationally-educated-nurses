/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Users - search', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('searches users in search bar', () => {
    cy.visitUserManagement();

    cy.searchUsers('ien');
  });
});
