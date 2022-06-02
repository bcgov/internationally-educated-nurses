/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO } from '@ien/common';
import dayjs from 'dayjs';

describe('Details - edit milestones', () => {
  let applicant: ApplicantRO;

  beforeEach(() => {
    cy.visit('/');
    cy.login();
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      cy.visitDetails(applicant.id);
      cy.tabRecruitment();
    });
  });

  it('edits a milestone', () => {
    cy.fixture('edit-milestone.json').then(milestone => {
      cy.get('#headlessui-disclosure-button-1').click();
      cy.get('[alt="edit milestone"]').eq(0).click();
      cy.get('#status').focus().type(`${milestone.status}{enter}`);
      cy.get('#start_date').focus().click().type(`${milestone.start_date}`);
      cy.get('#notes').click().clear().type(`${milestone.notes}`);
      cy.contains('button', 'Save Changes').click();

      cy.contains(milestone.status);
      cy.contains(dayjs(milestone.start_date).format('MMM DD, YYYY'));
      cy.contains(milestone.notes);
    });
  });
});
