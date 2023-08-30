/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

describe('Admin - BCCNM/NCAS Update', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/admin');
  });

  it.skip('validates BCCNM/NCAS data', () => {
    // upload file
    cy.contains('button', 'Upload').click();
    cy.get('[aria-label=file-upload-dropzone]').selectFile(
      ['cypress/fixtures/bccnm-ncas-creates.xlsx'],
      { force: true },
    );
    cy.contains('bccnm-ncas-creates.xlsx');
    cy.get('[data-cy=upload-file').click();
    cy.contains('button', 'Cancel');
    cy.contains('button', 'Apply');

    // filter
    cy.contains('All (4)');
    cy.contains('No changes (0)');
    cy.contains('Valid (2)');

    // validate messages
    cy.get('.text-bcRedError').should('have.length', 2);
    cy.contains('td', 'Applicant not found');
    cy.contains('td', 'is required');

    // cancel
    cy.contains('button', 'Cancel').click();
    cy.contains('button', 'Upload');
  });

  it.skip(`creates 'Signed Return of Service Agreement' milestones`, () => {
    cy.contains('button', 'Upload').click();
    cy.get('[aria-label=file-upload-dropzone]').selectFile(
      ['cypress/fixtures/bccnm-ncas-creates.xlsx'],
      { force: true },
    );
    cy.get('[data-cy=upload-file').click();
    cy.contains('button', 'Apply').click();
    cy.contains('2 applicants updated');
  });

  it(`update 'Signed Return of Service Agreement' milestones`, () => {
    cy.contains('button', 'Upload').click();
    cy.get('[aria-label=file-upload-dropzone]').selectFile(
      ['cypress/fixtures/bccnm-ncas-updates.xlsx'],
      { force: true },
    );
    cy.get('[data-cy=upload-file').click();

    cy.contains('All (2)');
    cy.contains('Valid (2)');
    cy.contains('button', 'Apply').click();
    cy.contains('2 applicants updated');
  });
});
