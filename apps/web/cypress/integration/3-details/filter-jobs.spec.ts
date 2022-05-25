/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe.skip('Details - filter jobs', () => {
  let applicant: ApplicantRO;
  let jobs: IENApplicantJobCreateUpdateDTO[];

  beforeEach(() => {
    cy.visit('/');
    cy.login();
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      jobs = data.jobs;
      cy.visitDetails(applicant.id);
      cy.tabRecruitment();
    });
  });

  afterEach(() => {
    cy.logout();
  });

  const filterJobsByHa = () => {
    const filteredJobs = jobs.slice(0, 2);
    filteredJobs.forEach(job => {
      cy.get('#ha').click().type(`${job.ha_pcn}{enter}`);
    });
    filteredJobs.forEach(job => cy.contains('span', job.ha_pcn));
    const matchedJobs = jobs.filter(j1 => filteredJobs.some(j2 => j2.ha_pcn === j1.ha_pcn));
    cy.get('[id^=headlessui-]').should('have.length', matchedJobs.length);
    return filteredJobs;
  };

  it('filters jobs by health authority', () => {
    filterJobsByHa();
  });

  it('filters jobs by specialty', () => {
    // set 'health authority' filter
    cy.get('#specialty').click().type(`${jobs[0].job_title}{enter}`);
    const matchedJobs = jobs.filter(j => jobs[0].job_title === j.job_title);
    cy.get('[id^=headlessui-]').should('have.length', matchedJobs.length);
  });

  it('filters jobs by health authority and specialty', () => {
    // set 'health authority' filter
    let matchedJobs = filterJobsByHa();

    // set specialty filter
    cy.get('#specialty').click().type(`${jobs[0].job_title}{enter}`);
    matchedJobs = matchedJobs.filter(j => jobs[0].job_title === j.job_title);
    cy.get('[id^=headlessui-]').should('have.length', matchedJobs.length);

    // clear filters
    cy.contains('button', 'Clear').click();
    cy.get('[id^=headlessui-]').should('have.length', jobs.length > 5 ? 5 : jobs.length);
  });
});
