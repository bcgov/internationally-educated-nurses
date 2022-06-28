import { ApplicantRO, IENApplicantAddStatusDTO, IENApplicantJobCreateUpdateDTO } from '@ien/common';
import { addCustomCommand } from 'cy-verify-downloads';
import dayjs from 'dayjs';

addCustomCommand();

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
    cy.contains('button', Cypress.env('username'), { timeout: 60000 });
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('button').contains(Cypress.env('username')).click();
  cy.get('button').contains('Logout').click();
  cy.contains('Login');
});

Cypress.Commands.add('searchApplicants', (name: string) => {
  cy.contains('Manage Applicants');

  cy.get('input').type(name);

  cy.get('div > span[class=my-auto]').each(() => {
    cy.contains(name);
  });

  cy.get('div > span[class=my-auto]').contains(name).click();

  cy.contains(name);
});

Cypress.Commands.add('searchUsers', (name: string) => {
  cy.get('input[data-cy=search-user-input]').eq(0).type(name);
  cy.waitForLoading();
  cy.get('tbody > tr').each(el => {
    cy.wrap(el).eq(0).find('td').eq(0).contains(name);
  });
});

Cypress.Commands.add('filterUsers', (roles: string[], revokedOnly: boolean) => {
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
        if (roles.includes(el.text())) throw Error(`${el.text()} shouldn't be visible.`);
      });
  });
  if (revokedOnly) {
    cy.contains('td', 'Active').should('not.exist');
    cy.contains('td', 'None').should('not.exist');
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
  cy.get('#recruiter_name').type(`${job.recruiter_name}`);
  cy.contains('button', 'Create').click();
});

Cypress.Commands.add('editJob', (job: IENApplicantJobCreateUpdateDTO) => {
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
  cy.get('#recruiter_name').type(`${job.recruiter_name}`);
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

Cypress.Commands.add('addMilestone', (milestone: IENApplicantAddStatusDTO) => {
  cy.get('#start_date').focus().click().type(`${milestone.start_date}`);
  cy.get('#notes').click().clear().type(`${milestone.notes}`);
  cy.get('form').find('#status').click({ force: true });
  cy.get('#status').each(el => {
    cy.wrap(el).focus().wait(100).type(`${milestone.status}{enter}`);
  });
  if (milestone.reason) {
    cy.get('form').find('#reason').click({ force: true });
    cy.get('#reason').click().type(`${milestone.reason}{enter}`);
  }
  if (milestone.effective_date) {
    cy.get('#effective_date').focus().click().type(`${milestone.effective_date}`);
  }
  cy.contains('button', 'Save Milestone').click();
  cy.wait(500);
  cy.contains(milestone.status);
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

Cypress.Commands.add('revokeAccess', (index: number) => {
  cy.contains('button', 'Change Role').eq(index).click();
  cy.get('[id=role-change]').focus().type('revoke{enter}');
  cy.contains('revoke-access');
  cy.contains('button', 'Confirm').should('be.disabled');
  cy.get('#confirm-text').focus().type('revoke-access');
  cy.contains('button', 'Confirm').should('not.be.disabled').click();
  cy.get('tbody > tr').eq(index).contains('td', 'Revoked');
});

Cypress.Commands.add('activate', () => {
  cy.contains('td', 'Revoked', { timeout: 1000 });
  cy.contains('button', 'Activate').click();
  cy.contains('td', 'Revoked').should('not.exist');
});

Cypress.Commands.add('pagination', () => {
  cy.contains('Showing 10');
  cy.get('tbody > tr').should('have.length', '10');
  cy.contains('1 - 10');

  // change limit to 5
  cy.get('select').eq(0).select('5');
  cy.contains('Showing 5');
  cy.get('tbody > tr').should('have.length', '5');

  // move to page 3
  cy.get('select').eq(1).select('3');
  cy.get('tbody > tr').should('have.length', '5');
  cy.contains('11 - 15');

  // move to page 2
  cy.get('.p-3.border-l').eq(0).click();
  cy.contains('6 - 10');
});

Cypress.Commands.add('visitDetails', (applicant: ApplicantRO) => {
  cy.visit(`/details?id=${applicant.id}`);
  cy.contains(applicant.name, { timeout: 60000 });
});

Cypress.Commands.add('tabRecruitment', () => {
  cy.contains('button', 'Recruitment').click();
});

Cypress.Commands.add('visitUserManagement', () => {
  cy.contains('User Management');
  cy.get('a:contains(User Management)').click();
  cy.contains('button', 'Change Role');
});

Cypress.Commands.add('waitForLoading', () => {
  cy.wait(500);
  cy.get('.animate-spin').should('not.exist');
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
