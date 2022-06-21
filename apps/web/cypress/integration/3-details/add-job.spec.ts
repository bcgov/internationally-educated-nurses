/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - add jobs', () => {
  let applicant: ApplicantRO;
  let jobs: IENApplicantJobCreateUpdateDTO[];
  let newJob: IENApplicantJobCreateUpdateDTO;

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      jobs = data.jobs;
      newJob = data.new;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant.id);
    cy.tabRecruitment();
  });

  it('adds job competitions', () => {
    cy.addJob(newJob);
    cy.contains(`${7} items`);
  });

  it('add - rejects duplicate job record', () => {
    const duplicateJob = jobs[0];

    cy.addDuplicateJob(duplicateJob);
  });
});
