/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Applicants - filter by tabs', () => {
  before(() => {
    cy.login();
    cy.visit('/');
  });

  it('clicks each tab on main page table', () => {
    cy.contains('Manage Applicants');
    cy.contains('button', 'Intake').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'Licensing/Registration').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'Recruitment').click();
    cy.get('td').should('have.length', 1);
    cy.contains('button', 'BC PNP').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'Final').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'All').click();
    cy.contains('a', 'Details');
  });
});
