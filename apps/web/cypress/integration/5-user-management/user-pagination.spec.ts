/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Pagination', () => {
  beforeEach(() => {
    cy.login();
  });

  it('user management pagination', () => {
    cy.visitUserManagement();
    cy.pagination();
  });
});
