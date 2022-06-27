/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('User Management - change role', () => {
  it('changes an employees role', () => {
    cy.login();
    cy.visit('/');
    cy.fixture('user-roles.json').then(({ roles }) => {
      cy.visitUserManagement();

      Cypress._.times(2, i => {
        cy.get('button:contains(Change Role)').eq(0).click();
        cy.contains('h1', 'Change Role');
        cy.changeRole(roles[i].role);
      });
    });
  });

  it('revokes user access', () => {
    cy.login();
    cy.visit('/');
    cy.visitUserManagement();

    cy.revokeAccess(0);
  });

  it('disallows a revoked user to log in', () => {
    cy.login('ien_e2e_hmbc');
    cy.visit('/');

    cy.contains('You are not authorized to use');
  });

  it('activates a revoked user', () => {
    cy.login();
    cy.visit('/');
    cy.visitUserManagement();

    cy.contains('td', 'Revoked');
    cy.contains('button', 'Activate').click();
    cy.contains('td', 'Revoked').should('not.exist');
  });
});
