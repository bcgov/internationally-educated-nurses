/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

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

    cy.filterUsers(['IENs ready for recruitment']);
    cy.get('#role-filter').clear();

    cy.filterUsers(['Reporting']);
    cy.get('#role-filter').clear();

    cy.filterUsers(['Provisioner', 'Reporting'], true);
  });
});
