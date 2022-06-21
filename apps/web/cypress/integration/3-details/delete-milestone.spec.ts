/// <reference types="cypress" />
/// <reference path="../../support/index.ts"/>

import dayjs from 'dayjs';

describe('Details - delete milestone', () => {
  before(() => {
    cy.visit('/');
    cy.login();
  });

  it('deletes a milestone', () => {
    let milestoneToDelete: any = null;

    cy.fixture('milestones.json').then(({ milestones }) => {
      milestoneToDelete = milestones[0];
    });

    cy.fixture('jobs.json').then(({ applicant }) => {
      cy.visitDetails(applicant.id);
      cy.tabRecruitment();

      cy.get('[data-cy=record-0]').click();
      cy.get('[alt="delete milestone"]').eq(0).should('exist').click();
      cy.contains('button', 'Yes').click();
      cy.contains(`${milestoneToDelete.status}`).should('not.exist');
      cy.contains(/^first milestone$/).should('not.exist');
      cy.contains(dayjs(milestoneToDelete.start_date).format('MMM DD, YYYY')).should('not.exist');
    });
  });
});
