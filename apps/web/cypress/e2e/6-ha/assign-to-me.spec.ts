/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

import { ApplicantRO } from '@ien/common';

describe('Applicants - assign to me', () => {
  const applicant = {
    id: 'c23ea09d-bbc5-4dd2-8ce2-9b21f3d571af',
    name: 'Gabriel Lockman',
  } as ApplicantRO;

  const fhaUser1 = 'ien_fha';
  const fhaUser2 = 'ien_fha2';
  const vihaUser = 'ien_viha';

  it(`assigns applicant to FHA user`, () => {
    cy.login(fhaUser1);
    cy.visit('/');
    cy.visitDetails(applicant);
    cy.contains('button', 'Assign to me').click();
    cy.get('[data-cy=recruiter]').contains(fhaUser1);
  });

  it(`assigns applicant to VIHA user`, () => {
    cy.login(vihaUser);
    cy.visit('/');
    cy.visitDetails(applicant);
    cy.contains('button', 'Assign to me').click();
    cy.get('[data-cy=recruiter]').contains(vihaUser);
  });

  it('reassigns applicant to a new user', () => {
    cy.login(fhaUser2);
    cy.visit('/');
    cy.visitDetails(applicant);
    cy.get('[data-cy=recruiter]').contains(fhaUser1).invoke('show').click();
    cy.get('[data-cy=recruiter]').contains(fhaUser2);
  });

  it(`hides 'assign to me' for non-ha users`, () => {
    cy.login();
    cy.visit('/');
    cy.visitDetails(applicant);
    cy.get('[data-cy=recruiter]').should('not.exist');
    cy.contains('button', 'Assign to me').should('not.exist');
  });
});
