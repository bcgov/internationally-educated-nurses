/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import dayjs from 'dayjs';
import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - edit job', () => {
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

  it('edit a job competition', () => {
    cy.get('[data-cy=record-0]').click();
    cy.contains('button', 'Edit Details').click();

    cy.fixture('edit-job.json').then(job => {
      cy.get('#ha_pcn').clear().type(`${job.ha_pcn}{enter}`);
      cy.get('#job_id').click().clear().type(`${job.job_id}`);
      cy.get('#job_title').click(); // it gets 'dom element not found error' without this repeated clicks
      cy.get('#job_title').click();
      cy.get('#job_title').click().clear().type(`${job.job_title}{enter}`);
      cy.get('#job_location').click().type('{backspace}');
      cy.get('#job_location').click().type(`${job.job_location}{enter}`);
      cy.get('#job_post_date').click().clear().type(`${job.job_post_date}`);
      cy.get('#recruiter_name').clear().type(`${job.recruiter_name}`);

      cy.contains('button', 'Update').click();

      cy.get('[data-cy=record-0]').contains(job.ha_pcn);
      cy.contains(job.job_id);
      cy.contains(job.job_title);
      cy.contains(job.job_location);
      cy.contains(dayjs(job.job_post_date).format('MMM DD, YYYY'));
    });
  });

  it('edit - rejects a duplicate job record', () => {
    const duplicateJob = jobs[2];

    cy.get('[data-cy=record-0]').click();
    cy.contains('button', 'Edit Details').click();

    cy.editDuplicateJob(duplicateJob);
  });
});
