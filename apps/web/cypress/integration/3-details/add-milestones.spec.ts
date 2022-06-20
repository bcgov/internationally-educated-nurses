/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - add milestones', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('adds milestones', () => {
    cy.fixture('jobs.json').then(({ applicant, jobs }) => {
      cy.visitDetails(applicant.id);
      cy.tabRecruitment();

      cy.get('[data-cy=record-0]').click();

      cy.fixture('milestones.json').then(({ milestones }) => {
        milestones.forEach(cy.addMilestone);
      });
    });
  });
});
