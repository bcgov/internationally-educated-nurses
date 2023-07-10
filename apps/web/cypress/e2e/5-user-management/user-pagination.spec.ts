/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

describe('Pagination', () => {
  beforeEach(() => {
    cy.login();
  });

  it('user management pagination', () => {
    cy.visitUserManagement();
    cy.pagination();
  });
});
