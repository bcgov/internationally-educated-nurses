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
Cypress.Commands.add('login', () => {
  cy.contains('Login');
  cy.get('button').click();
  if (Cypress.env('realm') === 'moh_applications') {
    cy.get('li').contains('Login with Keycloak').click();
  }

  cy.get('li').contains('Login with Keycloak').click();

  cy.get('#username').type(Cypress.env('username'));
  cy.get('#password').type(Cypress.env('password'));
  cy.get('#kc-login').click();
});

Cypress.Commands.add('logout', () => {
  cy.visit('/');
  // cy.login();
  cy.get('button').contains(Cypress.env('username'), { timeout: 60000 }).click();
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
