/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import dayjs from 'dayjs';

describe('Details - delete milestone', () => {
  before(() => {
    cy.visit('/');
    cy.login('ien_e2e_hmbc');
  });

  after(() => {
    cy.logout();
  });

  it('deletes a milestone', () => {
    let milestoneToDelete = null;

    cy.fixture('milestones.json').then(({ milestones }) => {
      milestoneToDelete = milestones[0];
    });

    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.visitDetails(applicant.id);
      cy.tabRecruitment();

      cy.get('#headlessui-disclosure-button-1').click();
      cy.get('[alt="delete milestone"]').eq(0).should('exist').click();
      cy.contains('button', 'Yes').click();
      cy.wait(4000);
      cy.contains(`${milestoneToDelete.status}`).should('not.exist');
      cy.contains(/^first milestone$/).should('not.exist');
      cy.contains(dayjs(milestoneToDelete.start_date).format('MMM DD, YYYY')).should('not.exist');
    });
    cy.wait(5000);
  });
});
