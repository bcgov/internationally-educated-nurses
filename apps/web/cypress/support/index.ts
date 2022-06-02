// ***********************************************************
// This example support/index.ts is processed and
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

import { IENApplicantAddStatusDTO, IENApplicantJobCreateUpdateDTO } from '@ien/common';

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<Element>;
      logout(): Chainable<Element>;
      searchApplicants(name: string): Chainable<Element>;
      searchUsers(name: string): Chainable<Element>;
      addJob(job: IENApplicantJobCreateUpdateDTO): void;
      addDuplicateJob(job: IENApplicantJobCreateUpdateDTO): void;
      editDuplicateJob(job: IENApplicantJobCreateUpdateDTO): void;
      addMilestone(milestone: IENApplicantAddStatusDTO): void;
      pagination(): void;
      visitDetails(applicantId: string): void;
      tabRecruitment(): void;
      changeRole(role: string): void;
      visitUserManagement(): void;
    }
  }
}

// Import commands.js using ES2015 syntax:
import './commands';
