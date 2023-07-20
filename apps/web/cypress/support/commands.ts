/// <reference types="cypress" />

import dayjs from 'dayjs';
import {
  ApplicantRO,
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
} from '@ien/common';

require('cy-verify-downloads').addCustomCommand();

Cypress.Commands.add('login', (username?: string) => {
  cy.session(username || Cypress.env('username'), () => {
    cy.visit('/');
    cy.contains('Login', { timeout: 60000 });
    cy.get('button').click();
    if (Cypress.env('realm') === 'moh_applications') {
      cy.get('li').contains('Login with Keycloak').click();
    }
    cy.get('#username').type(username ? username : Cypress.env('username'));
    cy.get('#password').type(Cypress.env('password'));
    cy.get('#kc-login').click();
    cy.contains('button', username || Cypress.env('username'), { timeout: 60000 });
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('button').contains(Cypress.env('username')).click();
  cy.get('button').contains('Logout').click();
  cy.contains('Login');
});

Cypress.Commands.add('searchApplicants', (name: string, show = true) => {
  cy.contains('Manage Applicants');

  cy.intercept(`/api/v1/ien?name=${name.split(' ').join('+')}&limit=5`).as('getApplicants');
  cy.get('input[data-cy="search-input"]').type(name);
  cy.wait('@getApplicants').then(() => {
    if (show) {
      cy.get('div[data-cy="search-result-item"]').each(el => {
        cy.wrap(el).contains(name);
      });
      cy.get('div[data-cy="search-result-item"]').eq(0).click();
      cy.contains(name);
      cy.visit('/applicants');
    } else {
      cy.get('div[data-cy="search-result-item"]').should('have.length', 0);
    }
    cy.get('input[data-cy="search-input"]').clear().type(`${name}{enter}`);
    if (show) {
      cy.get('tbody > tr').should('have.length.greaterThan', 0);
    } else {
      cy.get('tbody > tr').should('have.length', 0);
    }
  });
});

Cypress.Commands.add('searchUsers', (name: string) => {
  cy.get('input[data-cy=search-user-input]').eq(0).type(name);
  cy.waitForLoading();
  cy.get('tbody > tr').each(el => {
    cy.wrap(el).eq(0).find('td').eq(0).contains(name);
  });
});

Cypress.Commands.add('filterUsers', (roles: string[], revokedOnly = false) => {
  roles.forEach(role => cy.get('#role-filter').type(`${role}{enter}`));
  if (revokedOnly) {
    cy.get('#revoked-only').click();
  }
  cy.waitForLoading();
  cy.get('tbody > tr').each(el => {
    cy.wrap(el)
      .find('td')
      .eq(3)
      .each(el => {
        if (!roles.includes(el.text())) throw Error(`${el.text()} should be visible.`);
      });
  });
  if (revokedOnly) {
    cy.contains('td', 'Active').should('not.exist');
    cy.contains('td', 'Pending').should('not.exist');
    cy.get('#revoked-only').click();
  }
});

Cypress.Commands.add('addJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.contains('button', 'Add Record').click();
  cy.get('#ha_pcn').click().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').type(`${job.job_id}`);
  cy.get('#job_title').click();
  cy.get('#job_title').click().type(`${job.job_title}{enter}`);
  cy.get('#job_location').click().type(`${job.job_location}{enter}`);
  cy.get('#job_post_date').click().type(`${job.job_post_date}`);
  cy.contains('button', 'Create').click();
});

Cypress.Commands.add('editJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.get('#ha_pcn').clear().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').click().clear().type(`${job.job_id}`);
  cy.get('#job_title').click(); // it gets 'dom element not found error' without this repeated clicks
  cy.get('#job_title').click().clear();
  cy.get('#job_title').click().type(`${job.job_title}{enter}`);
  cy.get('#job_location').click().type('{backspace}');
  cy.get('#job_location').click().type(`${job.job_location}{enter}`);
  cy.get('#job_post_date').click().clear();
  cy.get('#job_post_date').click().clear().type(`${job.job_post_date}`);

  cy.contains('button', 'Update').click();

  cy.contains(job.ha_pcn);
  cy.contains(`${job.job_id}`);
  cy.contains(`${job.job_title}`);
  cy.contains(`${job.job_location}`);
  cy.contains(dayjs(job.job_post_date).format('MMM DD, YYYY'));
});

Cypress.Commands.add('addDuplicateJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.contains('button', 'Add Record').click();
  cy.get('#ha_pcn').click().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').type(`${job.job_id}`);
  cy.get('#job_location').click();
  cy.get('#job_location').type('{backspace}');
  cy.get('#job_location').type(`${job.job_location}{enter}`);
  cy.contains('button', 'Create').click();

  cy.contains(/^There is a job record with the same health authority and job id.$/);
  cy.contains('button', 'Cancel').click();
});

Cypress.Commands.add('editDuplicateJob', (job: IENApplicantJobCreateUpdateDTO) => {
  cy.get('#ha_pcn').clear().type(`${job.ha_pcn}{enter}`);
  cy.get('#job_id').click().clear().type(`${job.job_id}`);

  cy.contains('button', 'Update').click();

  cy.contains(/^There is a job record with the same health authority and job id.$/);
  cy.contains('button', 'Cancel').click();
});

Cypress.Commands.add('addMilestone', (milestone: any) => {
  cy.get('#start_date').focus().clear();
  cy.get('#start_date').focus().clear().type(`${milestone.start_date}`);
  cy.get('#notes').click().clear().type(`${milestone.notes}`);
  cy.get('form').find('#status').click({ force: true });
  cy.get('#outcomeType').each(el => {
    cy.wrap(el).focus().wait(100).type(`${milestone.milestone}{enter}`);
  });
  cy.get('#status').each(el => {
    cy.wrap(el).focus().wait(100).type(`${milestone.outcome}{enter}`);
  });
  if (milestone.reason) {
    cy.get('form').find('#reason').click({ force: true });
    cy.get('#reason').click().type(`${milestone.reason}{enter}`);
  }
  if (milestone.effective_date) {
    cy.get('#effective_date').focus().click().type(`${milestone.effective_date}{enter}`);
  }
  if (milestone.type) {
    cy.get('[type=radio]').check(milestone.type);
  }
  cy.contains('button', 'Save Milestone').click();
  cy.contains(milestone.outcome);
  cy.contains(`${milestone.notes}`);
});

Cypress.Commands.add('deleteMilestone', (index: number) => {
  cy.get('[data-cy="delete milestone"]').eq(index).click();
  cy.contains('button', 'Yes').click();
});

Cypress.Commands.add('changeRole', (role: string) => {
  cy.get('[id=role-change]').focus().type(`${role}{enter}`);
  cy.get('button:contains(Approve)').should('not.be.disabled').click();

  cy.contains('successfully updated');
});

Cypress.Commands.add('pagination', () => {
  cy.contains('Showing 10');
  cy.get('tbody > tr').should('have.length', 10);
  cy.contains('1 - 10');

  // change limit to 5
  cy.get('#user-page-top-size').click().type(`5{enter}`);
  cy.contains('Showing 5');
  cy.get('tbody > tr').should('have.length', 5);

  // move to page 3
  cy.get('#user-page-top-index').click().type(`3{enter}`);
  cy.get('tbody > tr').should('have.length.greaterThan', 1);

  // move to page 2
  cy.get('#user-page-top-index').click().type(`2{enter}`);
  cy.contains('6 - 10');
});

Cypress.Commands.add('visitDetails', (applicant: ApplicantRO) => {
  cy.intercept(`/api/v1/ien/${applicant.id}?relation=audit`).as('getApplicant');
  cy.visit(`/details?id=${applicant.id}`);
  cy.wait('@getApplicant').then(() => {
    cy.waitForLoading();
    cy.contains(applicant.name, { timeout: 60000 });
  });
});

Cypress.Commands.add('tabRecruitment', () => {
  cy.contains('button', 'Recruitment').click();
});

Cypress.Commands.add('visitUserManagement', () => {
  cy.visit('/user-management');
  cy.contains('User Management');
});

Cypress.Commands.add('waitForLoading', () => {
  cy.wait(500);
  cy.get('.animate-spin').should('not.exist');
});

Cypress.Commands.add('addApplicant', (applicant: IENApplicantCreateUpdateDTO) => {
  cy.get('#first_name').type(applicant.first_name);
  cy.get('#last_name').type(applicant.last_name);
  cy.get('#email_address').type(applicant.email_address);
  cy.get('#phone_number').type(applicant.phone_number || '');
  cy.get('#registration_date').type(applicant.registration_date);
  cy.get('#country_of_citizenship').click();
  cy.get('#country_of_citizenship').type(`${applicant.country_of_citizenship}{enter}`);
  cy.get('#country_of_residence').click().type(`${applicant.country_of_residence}{enter}`);
  cy.get('#pr_status').click().type(`${applicant.pr_status}{enter}`);
  applicant.nursing_educations.forEach((education, index) => {
    cy.get(`#nursing_educations\\[${index}\\]\\.name`).click().type(`${education.name}{enter}`);
    cy.get(`#nursing_educations\\[${index}\\]\\.year`).type(`${education.year}`);
    cy.get(`#nursing_educations\\[${index}\\]\\.country`).click();
    cy.get(`#nursing_educations\\[${index}\\]\\.country`)
      .click()
      .type(`${education.country}{enter}`);
    cy.get(`#nursing_educations\\[${index}\\]\\.num_years`).type(`${education.num_years}`);
    cy.get('button[data-cy="add-education"]').click();
    cy.contains(`${education.name} - ${education.year}`);
  });

  cy.get('button[data-cy="add-applicant"]').click();
  cy.contains(`${applicant.first_name} ${applicant.last_name}`);
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
