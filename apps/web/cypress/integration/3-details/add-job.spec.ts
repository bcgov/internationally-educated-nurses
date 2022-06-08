/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - add jobs', () => {
  let applicant: ApplicantRO;
  let jobs: IENApplicantJobCreateUpdateDTO[];

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      jobs = data.jobs;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant.id);
    cy.tabRecruitment();
  });

  it('adds job competitions', () => {
    jobs.forEach((job: IENApplicantJobCreateUpdateDTO, index: number) => {
      cy.addJob(job);
      cy.contains(`${index + 1} items`);
    });
  });

  it('add - rejects duplicate job record', () => {
    const duplicateJob = jobs[0];

    cy.addDuplicateJob(duplicateJob);
  });
});
