/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import dayjs from 'dayjs';

describe('Details - edit job', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  it('edit a job competition', () => {
    cy.fixture('jobs.json').then(({ applicant, jobs }) => {
      cy.visitDetails(applicant.id);
      cy.tabRecruitment();

      cy.get('#headlessui-disclosure-button-1').click();
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

        cy.get('#headlessui-disclosure-button-1').contains(job.ha_pcn);
        cy.contains(job.job_id);
        cy.contains(job.job_title);
        cy.contains(job.job_location);
        cy.contains(dayjs(job.job_post_date).format('MMM DD, YYYY'));
      });
    });
  });
});
