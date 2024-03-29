// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

/// <reference types="cypress" />

import {
  ApplicantRO,
  IENApplicantAddStatusDTO,
  IENApplicantCreateUpdateDTO,
  IENApplicantJobCreateUpdateDTO,
} from '@ien/common';

declare global {
  namespace Cypress {
    interface Chainable {
      addApplicant(applicant: IENApplicantCreateUpdateDTO): void;
      addDuplicateJob(job: IENApplicantJobCreateUpdateDTO): void;
      addJob(job: IENApplicantJobCreateUpdateDTO): void;
      addMilestone(milestone: IENApplicantAddStatusDTO): void;
      changeRole(role: string): void;
      deleteMilestone(index: number): void;
      editDuplicateJob(job: IENApplicantJobCreateUpdateDTO): void;
      editJob(job: IENApplicantJobCreateUpdateDTO): void;
      filterUsers(roles: string[], revokedOnly?: boolean): void;
      login(username?: string): Chainable<Element>;
      logout(): Chainable<Element>;
      pagination(): void;
      searchApplicants(name: string, show?: boolean): Chainable<Element>;
      searchUsers(name: string): Chainable<Element>;
      tabRecruitment(): void;
      visitDetails(applicant: ApplicantRO): void;
      visitUserManagement(): void;
      waitForLoading(): void;
    }
  }
}

// Import commands.js using ES2015 syntax:
import './commands';
