/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

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
    cy.get('#from').focus().type(`${from}{enter}`);
    cy.get('#to').focus().type(`${to}{enter}`);

    cy.get('form').contains('Applicants');

    cy.contains('button.bg-bcBluePrimary', 'Download').eq(0).click();

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
    cy.get('#from').focus().type(`${from}{enter}`);
    cy.get('#to').focus().type(`${to}{enter}`);

    cy.get('form').contains('Milestones');

    cy.contains('button.bg-bcBluePrimary', 'Download').eq(0).click();

    const fileName = `ien-milestones-data-extract_${from}-${to}.xlsx`;
    cy.verifyDownload(fileName, { contains: true });

    cy.task('checkDataExtract', {
      fileName,
      sheetNames: ['Rows as Milestones', 'Legend'],
    });
  });
});
