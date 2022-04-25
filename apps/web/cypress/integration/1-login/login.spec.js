/// <reference types="cypress" />

describe('Login page', () => {
  it('has login button', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Login');
  });
});
