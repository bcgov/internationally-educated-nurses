/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

describe('Admin - BCCNM/NCAS Update', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/admin');
  });

  it('validates BCCNM/NCAS data', () => {
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
    cy.contains('All (5)');
    cy.contains('No changes (3)');
    cy.contains('Valid (2)');

    // validate messages
    cy.get('.text-bcRedError').should('have.length', 3);
    cy.contains('td', 'Invalid country code');
    cy.contains('td', 'Applicant not found');
    cy.contains('td', 'No changes');

    // cancel
    cy.contains('button', 'Cancel').click();
    cy.contains('button', 'Upload');
  });

  it(`creates 'Signed Return of Service Agreement' milestones`, () => {
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

  it(`ignores milestones with a same date`, () => {
    cy.contains('button', 'Upload').click();
    cy.get('[aria-label=file-upload-dropzone]').selectFile(
      ['cypress/fixtures/bccnm-ncas-updates.xlsx'],
      { force: true },
    );
    cy.get('[data-cy=upload-file').click();

    cy.contains('All (2)');
    cy.contains('No changes (2)');
    cy.contains('button', 'Apply').should('be.disabled');
  });
});
