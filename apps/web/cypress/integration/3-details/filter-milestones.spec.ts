/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO } from '@ien/common';

describe('Details - filter milestones by tabs', () => {
  let applicant: ApplicantRO;

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant.id);
  });

  it('filters milestones by tabs', () => {
    cy.contains('button', 'Licensing/Registration').click();
    cy.get('[data-cy^=record-]').should('not.exist');
    cy.contains('button', 'Recruitment').click();
    cy.get('[data-cy^=record-]').should('exist');
    cy.contains('button', 'BC PNP').click();
    cy.get('[data-cy^=record-]').should('not.exist');
    cy.contains('button', 'Final').click();
    cy.get('[data-cy^=record-]').should('not.exist');
    cy.contains('button', 'Intake').click();
    cy.get('[data-cy^=record-]').should('not.exist');
  });
});
