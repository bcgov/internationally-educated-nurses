/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - add jobs', () => {
  let jobs: IENApplicantJobCreateUpdateDTO[];

  before(() => {
    cy.visit('/');
    cy.login();
    cy.fixture('jobs.json').then(data => {
      cy.visitDetails(data.applicant.id);
      jobs = data.jobs;
    });
  });

  after(() => {
    cy.logout();
  });

  it('adds job competitions', () => {
    cy.contains('Milestones Logs');

    cy.tabRecruitment();

    jobs.forEach((job: IENApplicantJobCreateUpdateDTO, index: number) => {
      cy.addJob(job);
      cy.contains(`${index + 1} items`);
    });

    cy.contains(`${jobs.length} items`);
  });

  it('add - rejects duplicate job record', () => {
    const duplicateJob = jobs[0];

    cy.tabRecruitment();

    cy.addDuplicateJob(duplicateJob);
  });
});
