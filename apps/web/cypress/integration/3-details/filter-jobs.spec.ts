/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Details - filter jobs', () => {
  let applicant: ApplicantRO;
  let jobs: IENApplicantJobCreateUpdateDTO[];
  let job: IENApplicantJobCreateUpdateDTO;

  before(() => {
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      jobs = data.jobs;
      job = jobs[3];
    });
  });

  beforeEach(() => {
    cy.login();
    cy.visitDetails(applicant.id);
    cy.tabRecruitment();
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
    cy.get('#specialty').click().type(`${job.job_title}{enter}`);
    const matchedJobs = jobs.filter(j => job.job_title === j.job_title);
    cy.get('[data-cy^=record-]').should('have.length', matchedJobs.length);
  });

  it('filters jobs by health authority and specialty', () => {
    // set 'health authority' filter
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
