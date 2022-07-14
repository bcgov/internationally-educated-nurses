/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('User Management - Details', () => {
  beforeEach(() => {});

  const visitUserDetails = () => {
    cy.login();
    cy.visitUserManagement();
    cy.contains('tr', 'ien_e2e_hmbc').find('a').eq(0).click();
  };

  it('changes an employees role', () => {
    visitUserDetails();
    cy.get('[data-cy=reporting]').find('[aria-checked=false]');
    cy.get('[data-cy=reporting]').find('button').click();
    cy.get('[data-cy=reporting]').find('[aria-checked=true]');
    cy.get('[data-cy=reporting]').find('button').click();
    cy.get('[data-cy=reporting]').find('[aria-checked=false]');
  });

  it('revokes user access', () => {
    visitUserDetails();
    cy.contains('Remove access');
    cy.get('[data-cy=revoke]').find('button').click();
  });

  it('denies access of revoked user', () => {
    cy.login('ien_e2e_hmbc');
    cy.visit('/');
    cy.contains('You are not authorized to use');
  });

  it('activates a revoked user', () => {
    visitUserDetails();
    cy.contains('Grant access');
    cy.get('[data-cy=revoke]').find('button').click();
    cy.contains('Remove access');
  });
});
