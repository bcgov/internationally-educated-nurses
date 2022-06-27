/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('User Management - change role', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('changes an employees role', () => {
    cy.fixture('user-roles.json').then(({ roles }) => {
      cy.visitUserManagement();

      Cypress._.times(2, i => {
        cy.get('button:contains(Change Role)').eq(i).click();
        cy.contains('h1', 'Change Role');
        cy.changeRole(roles[i].role);
      });
    });
  });
});
