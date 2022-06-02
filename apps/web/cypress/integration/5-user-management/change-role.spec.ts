/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('User Management - change role', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('changes an employees role', () => {
    cy.fixture('user-roles.json').then(({ roles }) => {
      cy.visitUserManagement();

      Cypress._.times(3, i => {
        cy.get('button:contains(Change Role)').eq(i).click();
        cy.contains('h1', 'Approve Access Request');
        cy.changeRole(roles[i].role);
      });
    });
  });
});
