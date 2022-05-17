/// <reference types="cypress" />

describe('Click Tabs on main page', () => {
  it('clicks each tab on main page table', () => {
    cy.visit('/');
    cy.contains('Manage Applicants');

    cy.contains('button', 'Intake').click();
    cy.contains('button', 'Licensing/Registration').click();
    cy.contains('button', 'Recruitment').click();
    cy.contains('button', 'BC PNP').click();
    cy.contains('button', 'Final').click();
    cy.contains('button', 'All').click();
  });

  it('clicks each milestones log tab on applicant details page', () => {
    cy.visit('/');
    cy.contains('a', 'Details').click();

    cy.contains('Milestones Logs');

    cy.contains('button', 'Licensing/Registration').click();
    cy.contains('button', 'Recruitment').click();
    cy.contains('button', 'BC PNP').click();
    cy.contains('button', 'Final').click();
    cy.contains('button', 'Intake').click();
  });
});
