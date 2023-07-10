/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';
import dayjs from 'dayjs';

describe('Details - Milestones', () => {
  let applicant: ApplicantRO;

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant);
    cy.tabRecruitment();
  });

  it('adds a milestone', () => {
    cy.fixture('milestones.json').then(data => {
      cy.get('[data-cy=record-0]').click();
      cy.addMilestone(data.new);
    });
  });

  it('edits a milestone', () => {
    cy.fixture('milestones.json').then(({ update }) => {
      cy.get('[data-cy=record-0]').click();

      cy.get('[alt="edit milestone"]').eq(0).click();

      cy.get('#outcomeType').each(el => {
        cy.wrap(el).focus().wait(100).type(`${update.milestone}{enter}`);
      });
      cy.get('#status').focus().type(`${update.outcome}{enter}`);
      cy.get('#notes').click().clear().type(`${update.notes}`);

      cy.get('#start_date').click({ force: true });
      cy.get('#start_date').focus().clear();
      cy.get('#start_date').focus().type(`${update.start_date}{enter}`);

      cy.contains('button', 'Save Changes').click();

      cy.contains(update.outcome);
      cy.contains(dayjs(update.start_date).format('MMM DD, YYYY'));
      cy.contains(update.notes);
    });
  });

  it('deletes a milestone', () => {
    cy.fixture('milestones.json').then(data => {
      cy.get('[data-cy=record-0]').click();
      cy.deleteMilestone(0);
      cy.contains(`${data.update.outcome}`).should('not.exist');
      cy.contains(`${data.update.notes}`).should('not.exist');
    });
  });

  it('filters milestones by tabs', () => {
    cy.contains('button', 'Licensing/Registration').click();
    cy.get('[data-cy^=record-]').should('not.exist');
    cy.contains('button', 'Recruitment').click();
    cy.get('[data-cy^=record-]').should('exist');
    cy.contains('button', 'BC PNP').click();
    cy.get('[data-cy^=record-]').should('not.exist');
  });
});
