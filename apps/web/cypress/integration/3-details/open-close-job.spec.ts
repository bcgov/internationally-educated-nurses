/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO, IENApplicantJobCreateUpdateDTO } from '@ien/common';
import dayjs from 'dayjs';

describe('Details - close/reopen a job', () => {
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
    cy.get('[data-cy=record-0]').click();
  });

  it('closes a job competition by withdraw', () => {
    cy.fixture('open-close-job-milestone.json').then(({ withdraw }) => {
      cy.addMilestone(withdraw);
      cy.contains(`Complete - ${withdraw.status}`);
    });
  });

  it('reopen a job competition', () => {
    cy.fixture('open-close-job-milestone.json').then(({ reopen }) => {
      cy.addMilestone(reopen);
      cy.contains(`On Going - ${reopen.status}`);
    });
  });

  it('closes a job competition by accepting an offer', () => {
    cy.fixture('open-close-job-milestone.json').then(({ acceptOffer }) => {
      cy.addMilestone(acceptOffer);
      cy.contains(`Complete - ${acceptOffer.status}`);
    });
  });
});
