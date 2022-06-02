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
      cy.contains('User Management');
      cy.userManagement();
      cy.get('h4').should('have.text', 'Manage user access and user roles');

      cy.get('button:contains(Change Role)').each((el, index) => {
        cy.wrap(roles[index]);
        cy.wrap(el).click();
        cy.contains('h1', 'Approve Access Request');
        cy.changeRole(roles[index].role);
      });
    });
  });
});
