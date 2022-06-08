/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Pagination', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('user management pagination', () => {
    cy.visitUserManagement();

    cy.pagination();
  });
});
