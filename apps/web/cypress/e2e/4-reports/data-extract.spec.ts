/// <reference types="cypress" />
/// <reference types="cy-verify-downloads" />
/// <reference path="../../support/e2e.ts"/>

import dayjs from 'dayjs';

const login = (id: string) => {
  cy.login(id);
  cy.visit('/');
  cy.contains('a', 'Reporting', { timeout: 60000 }).click();
};

describe('Data Extract for HMBC', () => {
  it('downloads applicant data extract', () => {
    login('ien_hmbc');

    cy.get('input').should('have.class', 'bg-bcGrayInput');

    const from = '2020-01-01';
    const to = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    // Wait for the form to load and find the date input elements
    cy.contains('Data Extract').should('be.visible');
    cy.get('#from', { timeout: 10000 }).should('be.visible');
    cy.get('#to', { timeout: 10000 }).should('be.visible');

    // Use the same pattern as other successful date inputs in this codebase
    // The key insight: use {enter} after typing to trigger proper form validation
    cy.get('#from').click().clear().type(`${from}{enter}`);
    cy.get('#to').click().clear().type(`${to}{enter}`);

    // Give Formik time to process the field changes
    cy.wait(1000);

    cy.get('form').contains('Applicants');

    // Button should now be enabled after proper form field updates
    cy.contains('button.bg-bcBluePrimary', 'Download').eq(0).should('not.be.disabled').click();

    const fileName = `ien-applicants-data-extract_${from}-${to}.xlsx`;
    cy.verifyDownload(fileName, { contains: true });

    cy.task('checkDataExtract', {
      fileName,
      sheetNames: ['Rows as Users', 'Legend'],
    });
  });

  it('downloads milestone data extract', () => {
    login('ien_moh');

    cy.get('input').should('have.class', 'bg-bcGrayInput');

    const from = '2020-01-01';
    const to = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    // Wait for the form to load and find the date input elements
    cy.contains('Data Extract').should('be.visible');
    cy.get('#from', { timeout: 10000 }).should('be.visible');
    cy.get('#to', { timeout: 10000 }).should('be.visible');

    // Use the same pattern as other successful date inputs in this codebase
    // The key insight: use {enter} after typing to trigger proper form validation
    cy.get('#from').click().clear().type(`${from}{enter}`);
    cy.get('#to').click().clear().type(`${to}{enter}`);

    // Give Formik time to process the field changes
    cy.wait(1000);

    cy.get('form').contains('Milestones');

    // Button should now be enabled after proper form field updates
    cy.contains('button.bg-bcBluePrimary', 'Download').eq(0).should('not.be.disabled').click();

    const fileName = `ien-milestones-data-extract_${from}-${to}.xlsx`;
    cy.verifyDownload(fileName, { contains: true });

    cy.task('checkDataExtract', {
      fileName,
      sheetNames: ['Rows as Milestones', 'Legend'],
    });
  });
});
