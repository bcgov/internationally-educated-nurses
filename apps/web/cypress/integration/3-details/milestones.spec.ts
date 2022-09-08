/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

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
    cy.fixture('edit-milestone.json').then(milestone => {
      cy.get('[data-cy=record-0]').click();

      cy.get('[alt="edit milestone"]').eq(0).click();

      cy.get('#status').focus().type(`${milestone.outcome}{enter}`);
      cy.get('#notes').click().clear().type(`${milestone.notes}`);

      cy.get('#start_date').click({ force: true });
      cy.get('#start_date').focus().clear();
      cy.get('#start_date').focus().type(`${milestone.start_date}{enter}`);

      cy.contains('button', 'Save Changes').click();

      cy.contains(milestone.outcome);
      cy.contains(dayjs(milestone.start_date).format('MMM DD, YYYY'));
      cy.contains(milestone.notes);
    });
  });

  it('deletes a milestone', () => {
    cy.fixture('milestones.json').then(data => {
      cy.get('[data-cy=record-0]').click();
      cy.deleteMilestone(0);
      cy.contains(`${data.new.outcome}`).should('not.exist');
      cy.contains(`${data.new.notes}`).should('not.exist');
      cy.contains(dayjs(data.new.start_date).format('MMM DD, YYYY')).should('not.exist');
    });
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
