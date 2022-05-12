/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { IENApplicantJobCreateUpdateDTO } from '@ien/common';

describe('Add Job', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it('add job competitions', () => {
    cy.fixture('jobs.json').then(({ applicant, jobs }) => {
      cy.visitDetails(applicant.id);
      cy.contains('Milestones Logs');

      cy.tabRecruitment();

      jobs.forEach((job: IENApplicantJobCreateUpdateDTO, index: number) => {
        cy.addJob(job);
        cy.contains(`${index + 1} items`);
      });

      cy.contains(`${jobs.length} items`);
    });
  });
});
