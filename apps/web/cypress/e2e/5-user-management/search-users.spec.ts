/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

describe('Users - search / filter', () => {
  beforeEach(() => {
    cy.login();
    cy.visitUserManagement();
  });

  it('searches users in search bar', () => {
    cy.searchUsers('ien');
  });

  it('filters users by role and revocation', () => {
    cy.filterUsers(['Provisioner']);
    cy.get('#role-filter').clear();

    cy.filterUsers(['Manage Applicants']);
    cy.get('#role-filter').clear();

    cy.filterUsers(['Reporting']);
    cy.get('#role-filter').clear();

    cy.filterUsers(['Provisioner', 'Reporting'], true);
  });
});
