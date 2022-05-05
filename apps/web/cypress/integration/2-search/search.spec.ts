/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Search User', () => {
  it('searches user in search bar', () => {
    cy.visit('/');
    if (Cypress.env('realm') === 'ien') {
      cy.login();
    }
    cy.search('Mark');
  });
});
