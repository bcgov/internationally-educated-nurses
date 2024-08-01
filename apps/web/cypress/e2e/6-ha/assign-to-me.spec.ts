/// <reference types="cypress" />
/// <reference path="../../support/e2e.ts"/>

import { ApplicantRO } from '@ien/common';

describe('Applicants - assign to me', () => {
  const applicant1 = {
    id: 'c23ea09d-bbc5-4dd2-8ce2-9b21f3d571af',
    name: 'Gabriel Lockman',
  } as ApplicantRO;

  const applicant2 = {
    id: '8385c912-40aa-46d8-9cfb-fc9785db9804',
    name: 'Trudie Grimes',
  } as ApplicantRO;

  const fhaUser1 = 'ien_fha';
  const fhaUser2 = 'ien_fha2';
  const vihaUser = 'ien_viha';

  it(`assigns applicant to FHA user`, () => {
    cy.login(fhaUser1);
    cy.visit('/');
    cy.visitDetails(applicant1);
    cy.contains('button', 'Assign to me').click();
    cy.get('[data-cy=recruiter]').contains(fhaUser1);
    cy.visitDetails(applicant2);
    cy.contains('button', 'Assign to me').click();
    cy.get('[data-cy=recruiter]').contains(fhaUser1);
  });

  it(`assigns applicant to VIHA user`, () => {
    cy.login(vihaUser);
    cy.visit('/');
    cy.visitDetails(applicant1);
    cy.contains('button', 'Assign to me').click();
    cy.get('[data-cy=recruiter]').contains(vihaUser);
  });

  // it('reassigns applicant to a new user', () => {
  //   cy.login(fhaUser2);
  //   cy.visit('/');
  //   cy.visitDetails(applicant1);
  //   cy.get('[data-cy=recruiter]').contains(fhaUser1).invoke('show').click();
  //   cy.get('[data-cy=recruiter]').contains(fhaUser2);
  // });

  it(`hides 'assign to me' for non-ha users`, () => {
    cy.login();
    cy.visit('/');
    cy.visitDetails(applicant1);
    cy.get('[data-cy=recruiter]').should('not.exist');
    cy.contains('button', 'Assign to me').should('not.exist');
  });

  // it('shows applicants assigned to other users in the same HA', () => {
  //   cy.login(fhaUser1);
  //   cy.visit('/');
  //   cy.contains('td', fhaUser2);
  //   cy.contains('td', vihaUser).should('not.exist');
  // });

  // it('shows applicants only assigned to me', () => {
  //   cy.login(fhaUser2);
  //   cy.visit('/');
  //   cy.get('tbody > tr').should('have.length.greaterThan', 1);
  //   cy.contains('td', fhaUser2);

  //   cy.get('[data-cy=my-applicants-only]').find('button').click();
  //   cy.get('tbody > tr').should('have.length', 1);
  //   cy.contains('td', fhaUser2).should('have.length', 1);

  //   cy.get('[data-cy=my-applicants-only]').find('button').click();
  //   cy.get('tbody > tr').should('have.length.greaterThan', 1);
  // });

  // it('sorts applicants by recruiter name', () => {
  //   cy.login(fhaUser1);
  //   cy.visit('/');
  //   cy.get('#sort-by-recruiter').click();
  //   cy.get('tbody > tr').eq(0).contains(applicant2.name);
  //   cy.get('#sort-by-recruiter').click();
  //   cy.get('tbody > tr').eq(0).contains(applicant1.name);
  // });
});
