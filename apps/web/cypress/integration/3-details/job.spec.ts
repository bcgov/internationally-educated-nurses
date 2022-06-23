/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - Job', () => {
  let applicant: ApplicantRO;
  let jobs: IENApplicantJobCreateUpdateDTO[];
  let newJob: IENApplicantJobCreateUpdateDTO;
  let updateJob: IENApplicantJobCreateUpdateDTO;

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      jobs = data.jobs;
      newJob = data.new;
      updateJob = data.update;
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant.id);
    cy.tabRecruitment();
  });

  it('adds a job record', () => {
    cy.contains(applicant.name);
    cy.addJob(newJob);
    cy.contains(`${7} items`);
  });

  it('rejects duplicate job record', () => {
    const duplicateJob = jobs[0];

    cy.addDuplicateJob(duplicateJob);
  });

  it('edits a job competition', () => {
    cy.get('[data-cy=record-1]').click(); // to place the record at the top
    cy.contains('button', 'Edit Details').click();
    cy.editJob(updateJob);
  });

  it('rejects a duplicate job record by editing', () => {
    const duplicateJob = jobs[2];

    cy.get('[data-cy=record-0]').click();
    cy.contains('button', 'Edit Details').click();

    cy.editDuplicateJob(duplicateJob);
  });

  it('closes a job competition by withdraw', () => {
    cy.get('[data-cy=record-0]').click();
    cy.fixture('open-close-job-milestone.json').then(({ withdraw }) => {
      cy.addMilestone(withdraw);
      cy.contains(`Complete - ${withdraw.status}`);
    });
  });

  it('reopen a job competition', () => {
    cy.get('[data-cy=record-0]').click();
    cy.fixture('open-close-job-milestone.json').then(({ reopen }) => {
      cy.addMilestone(reopen);
      cy.contains(`On Going - ${reopen.status}`);
      cy.deleteMilestone(5);
      cy.deleteMilestone(4);
    });
  });

  it('closes a job competition by accepting an offer', () => {
    cy.get('[data-cy=record-0]').click();
    cy.fixture('open-close-job-milestone.json').then(({ acceptOffer }) => {
      cy.addMilestone(acceptOffer);
      cy.contains(`Complete - ${acceptOffer.status}`);
      cy.deleteMilestone(4);
    });
  });

  const filterJobsByHa = () => {
    const filteredJobs = jobs.slice(2, 4);
    filteredJobs.forEach(job => {
      cy.get('#ha').click().type(`${job.ha_pcn}{enter}`);
    });
    filteredJobs.forEach(job => cy.contains('span', job.ha_pcn));
    const matchedJobs = jobs.filter(j1 => filteredJobs.some(j2 => j2.ha_pcn === j1.ha_pcn));
    cy.get('[data-cy^=record-]').should('have.length', matchedJobs.length);
    return filteredJobs;
  };

  it('filters jobs by health authority', () => {
    filterJobsByHa();
  });

  it('filters jobs by specialty', () => {
    // set 'health authority' filter
    const job = jobs[3];
    cy.get('#specialty').click().type(`${job.job_title}{enter}`);
    const matchedJobs = jobs.filter(j => job.job_title === j.job_title);
    cy.get('[data-cy^=record-]').should('have.length', matchedJobs.length);
  });

  it('filters jobs by health authority and specialty', () => {
    // set 'health authority' filter
    const job = jobs[3];
    let matchedJobs = filterJobsByHa();

    // set specialty filter
    cy.get('#specialty').click().type(`${job.job_title}{enter}`);
    matchedJobs = matchedJobs.filter(j => job.job_title === j.job_title);
    cy.get('[data-cy^=record-]').should('have.length', matchedJobs.length);

    // clear filters
    cy.contains('button', 'Clear').click();
    cy.get('[data-cy^=record-]').should('have.length', jobs.length > 5 ? 5 : jobs.length);
  });
});
