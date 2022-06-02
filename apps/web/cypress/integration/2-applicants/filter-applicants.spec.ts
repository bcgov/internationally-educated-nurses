/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

describe('Applicants - filter by tabs', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('clicks each tab on main page table', () => {
    cy.visit('/');
    cy.contains('Manage Applicants');
    cy.contains('button', 'Intake').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'Licensing/Registration').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'Recruitment').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'BC PNP').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'Final').click();
    cy.get('td').should('not.exist');
    cy.contains('button', 'All').click();
    cy.contains('a', 'Details');
  });
});
