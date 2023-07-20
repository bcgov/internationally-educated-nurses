/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

import { ApplicantRO } from '@ien/common';

describe('Applicants - Active/ Inactive', () => {
  const applicant1 = {
    id: 'c23ea09d-bbc5-4dd2-8ce2-9b21f3d571af',
    name: 'Gabriel Lockman',
  } as ApplicantRO;

  const fhaUser1 = 'ien_fha';
  const vihaUser = 'ien_viha';

  it(`make active applicant hidden`, () => {
    cy.login(fhaUser1);
    cy.visit('/');
    cy.visitDetails(applicant1);
    cy.get('[data-cy=active-text]').should('have.text', 'Applicant is Visible');
    cy.get('[data-cy=active-toggle]').find('button').click();
    cy.get('[data-cy=active-text]').should('have.text', 'Applicant is Hidden');
  });

  it(`inactive applicant in one HA should not affect active applicant in another HA`, () => {
    cy.login(vihaUser);
    cy.visit('/');
    cy.visitDetails(applicant1);
    cy.get('[data-cy=active-text]').should('have.text', 'Applicant is Visible');
  });

  it(`hide/ unhide inactive applicants`, () => {
    cy.login(fhaUser1);
    cy.visit('/');
    cy.get('tbody > tr').should('have.length', 1);
    cy.get('[data-cy="hide-inactive-applicants"]').find('button').click();
    cy.get('tbody > tr').should('have.length', 2);
    cy.get('[data-cy="hide-inactive-applicants"]').find('button').click();
    cy.get('tbody > tr').should('have.length', 1);
  });

  it(`make inactive applicant active`, () => {
    cy.login(fhaUser1);
    cy.visit('/');
    cy.visitDetails(applicant1);
    cy.get('[data-cy=active-text]').should('have.text', 'Applicant is Hidden');
    cy.get('[data-cy=active-toggle]').find('button').click();
    cy.get('[data-cy=active-text]').should('have.text', 'Applicant is Visible');
  });
});
