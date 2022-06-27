/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Users - search / filter', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
    cy.visitUserManagement();
  });

  it('searches users in search bar', () => {
    cy.searchUsers('ien');
  });

  it('filters users by role and revocation', () => {
    cy.filterUsers(['moh'], false);
    cy.get('#role-filter').clear();

    cy.filterUsers(['hmbc'], false);
    cy.get('#role-filter').clear();

    cy.filterUsers(['pending'], false);
    cy.get('#role-filter').clear();

    cy.revokeAccess(0);
    cy.filterUsers(['moh', 'hmbc'], true);
    cy.activate();
  });
});
