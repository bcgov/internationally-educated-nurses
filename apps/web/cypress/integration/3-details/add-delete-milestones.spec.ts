/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';
import dayjs from 'dayjs';

describe('Details - add milestones', () => {
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

  it('adds milestones', () => {
    cy.fixture('jobs.json').then(({ applicant, jobs }) => {
      cy.get('[data-cy=record-0]').click();
      cy.fixture('milestones.json').then(data => cy.addMilestone(data.new));
    });
  });

  it('deletes a milestone', () => {
    cy.fixture('milestones.json').then(data => {
      cy.get('[data-cy=record-0]').click();
      cy.get('[alt="delete milestone"]').last().should('exist').click();
      cy.contains('button', 'Yes').click();
      cy.contains(`${data.new.status}`).should('not.exist');
      cy.contains(/^first milestone$/).should('not.exist');
      cy.contains(dayjs(data.new.start_date).format('MMM DD, YYYY')).should('not.exist');
    });
  });
});
