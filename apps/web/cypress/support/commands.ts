// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
import { IENApplicantAddStatusDTO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

Cypress.Commands.add('login', () => {
  cy.contains('Login');
  cy.get('button').click();
  if (Cypress.env('realm') === 'moh_applications') {
    cy.get('li').contains('Login with Keycloak').click();
  }
  cy.get('#username').type(Cypress.env('username'));
  cy.get('#password').type(Cypress.env('password'));
  cy.get('#kc-login').click();
  cy.get('button').contains(Cypress.env('username'), { timeout: 60000 });
});

Cypress.Commands.add('logout', () => {
  cy.get('button').contains(Cypress.env('username')).click();
  cy.get('button').contains('Logout').click();
  cy.contains('Login');
});

Cypress.Commands.add('search', (name: string) => {
  cy.contains('Manage Applicants');

  cy.get('input').type(name);

  cy.get('div > span[class=my-auto]').each(() => {
    cy.contains(name);
  });

  cy.get('div > span[class=my-auto]').contains(name).click();

  cy.contains(name);
});

Cypress.Commands.add('addJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.contains('button', 'Add Record').click();
  cy.get('#ha_pcn').click().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').type(`${job.job_id}`);
  cy.get('#job_title').click();
  cy.get('#job_title').click().type(`${job.job_title}{enter}`);
  cy.get('#job_location').click().type(`${job.job_location}{enter}`);
  cy.get('#job_post_date').click().type(`${job.job_post_date}`);
  cy.get('#recruiter_name').type(`${job.recruiter_name}`);
  cy.contains('button', 'Create').click();
});

Cypress.Commands.add('addDuplicateJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.contains('button', 'Add Record').click();
  cy.get('#ha_pcn').click().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').type(`${job.job_id}`);
  cy.get('#recruiter_name').type(`${job.recruiter_name}`);
  cy.contains('button', 'Create').click();

  cy.contains(/^There is a job record with the same health authority and job id.$/);
  cy.get('div[class=Toastify__toast-body]').should('not.exist', { timeout: 4000 });
  cy.contains('button', 'Cancel').click();
});

Cypress.Commands.add('editDuplicateJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.contains('button', 'Edit Details').click();

  cy.get('#ha_pcn').clear().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').click().clear().type(`${job.job_id}`);

  cy.contains('button', 'Update').click();

  cy.contains(/^There is a job record with the same health authority and job id.$/);
  cy.get('div[class=Toastify__toast-body]').should('not.exist', { timeout: 4000 });
  cy.contains('button', 'Cancel').click();
});

Cypress.Commands.add('addMilestone', (milestone: IENApplicantAddStatusDTO) => {
  cy.get('form').find('#status').click({ force: true });
  cy.get('#status').focus().type(`${milestone.status}{enter}`);
  cy.get('#start_date').focus().click().type(`${milestone.start_date}`);
  cy.get('#notes').click().clear().type(`${milestone.notes}`);
  if (milestone.reason) {
    cy.get('form').find('#reason').click({ force: true });
    cy.get('#reason').click().type(`${milestone.reason}{enter}`);
  }
  if (milestone.effective_date) {
    cy.get('#effective_date').focus().click().type(`${milestone.effective_date}`);
  }
  cy.contains('button', 'Save Milestone').click();
});

Cypress.Commands.add('changeRole', (role: string) => {
  cy.get('[id=role-change]').focus().type(`${role}{enter}`);
  cy.get('button:contains(Submit)').should('not.be.disabled').click();

  cy.contains('successfully updated');
  cy.get('div[class=Toastify__toast-body]').should('not.exist', { timeout: 4000 });
});

Cypress.Commands.add('visitDetails', (applicantId: string) => {
  cy.visit(`/details?id=${applicantId}`);
});

Cypress.Commands.add('tabRecruitment', () => {
  cy.get('#3').click();
});

Cypress.Commands.add('userManagement', () => {
  cy.get('a:contains(User Management)').click();
});
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
