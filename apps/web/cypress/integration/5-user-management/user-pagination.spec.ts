/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Pagination', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('user management pagination', () => {
    cy.visitUserManagement();

    cy.pagination();
  });
});
