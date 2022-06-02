/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import { ApplicantRO } from '@ien/common';

describe('Details - filter milestones by tabs', () => {
  let applicant: ApplicantRO;

  beforeEach(() => {
    cy.visit('/');
    cy.login();
    cy.fixture('jobs.json').then(data => {
      applicant = data.applicant;
      cy.visitDetails(applicant.id);
    });
  });

  it('filters milestones by tabs', () => {
    cy.contains('button', 'Licensing/Registration').click();
    cy.get('[id^=headlessui-disclosure-button').should('not.exist');
    cy.contains('button', 'Recruitment').click();
    cy.get('[id^=headlessui-disclosure-button').should('exist');
    cy.contains('button', 'BC PNP').click();
    cy.get('[id^=headlessui-disclosure-button').should('not.exist');
    cy.contains('button', 'Final').click();
    cy.get('[id^=headlessui-disclosure-button').should('not.exist');
    cy.contains('button', 'Intake').click();
    cy.get('[id^=headlessui-disclosure-button').should('not.exist');
  });
});
