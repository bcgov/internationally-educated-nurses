/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import dayjs from 'dayjs';
import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - edit job', () => {
  let applicant: ApplicantRO;
  let jobs: IENApplicantJobCreateUpdateDTO[];
  let updateJob: IENApplicantJobCreateUpdateDTO;

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      jobs = data.jobs;
      updateJob = data.update;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant.id);
    cy.tabRecruitment();
  });

  it('edit a job competition', () => {
    cy.get('[data-cy=record-0]').click();
    cy.contains('button', 'Edit Details').click();
    cy.editJob(updateJob);
    cy.contains('button', 'Edit Details').click();
    cy.editJob(jobs[jobs.length - 1]);
  });

  it('edit - rejects a duplicate job record', () => {
    const duplicateJob = jobs[2];

    cy.get('[data-cy=record-0]').click();
    cy.contains('button', 'Edit Details').click();

    cy.editDuplicateJob(duplicateJob);
  });
});
