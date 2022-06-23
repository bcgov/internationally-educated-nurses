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
    cy.visitDetails(applicant.id);
    cy.tabRecruitment();
  });

  it('adds a milestone', () => {
    cy.fixture('milestones.json').then(data => {
      cy.get('[data-cy=record-0]').click();
      cy.addMilestone(data.new);
    });
  });

  it('deletes a milestone', () => {
    cy.fixture('milestones.json').then(data => {
      cy.get('[data-cy=record-0]').click();
      cy.deleteMilestone(4);
      cy.contains(`${data.new.status}`).should('not.exist');
      cy.contains(`${data.new.notes}`).should('not.exist');
      cy.contains(dayjs(data.new.start_date).format('MMM DD, YYYY')).should('not.exist');
    });
  });

  it('edits a milestone', () => {
    cy.fixture('edit-milestone.json').then(milestone => {
      cy.get('[data-cy=record-0]').click();
      cy.get('[alt="edit milestone"]').eq(0).click();
      cy.get('#status').focus().type(`${milestone.status}{enter}`);
      cy.get('#start_date').focus().click().type(`${milestone.start_date}`);
      cy.get('#notes').click().clear().type(`${milestone.notes}`);
      cy.contains('button', 'Save Changes').click();

      cy.contains(milestone.status);
      cy.contains(dayjs(milestone.start_date).format('MMM DD, YYYY'));
      cy.contains(milestone.notes);
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
