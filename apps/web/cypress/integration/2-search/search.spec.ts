/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Search User', () => {
  it('search user in search bar', () => {
    cy.visit('/');
    cy.login();
    cy.search('Mark');
  });
});
