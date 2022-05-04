/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Log out', () => {
  it('log out', () => {
    cy.logout();
  });
});
