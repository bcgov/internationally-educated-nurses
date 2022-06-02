/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - add jobs', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('adds job competitions', () => {
    cy.fixture('jobs.json').then(({ applicant, jobs }) => {
      cy.visitDetails(applicant.id);
      cy.contains('Milestones Logs');

      cy.tabRecruitment();

      jobs.forEach((job: IENApplicantJobCreateUpdateDTO, index: number) => {
        cy.addJob(job);
        cy.contains(`${index + 1} items`);
      });

      cy.contains(`${jobs.length} items`);
    });
  });

  it('add - rejects duplicate job record', () => {
    cy.fixture('jobs.json').then(({ applicant, jobs }) => {
      const duplicateJob = jobs[0];

      cy.visitDetails(applicant.id);
      cy.contains('Milestones Logs');

      cy.tabRecruitment();

      cy.addDuplicateJob(duplicateJob);
    });
  });
});
