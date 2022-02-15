import {
  PersonalInformationDTO,
  PreferencesInformationDTO,
  ContactInformationDTO,
  SubmissionPayloadDTO,
  RegistrationStatus,
  getSpecialtyById,
  getSubSpecialtyById,
  EmploymentTypes,
  HealthAuthorities,
  DeploymentDurations,
  DeploymentTypes,
  PlacementOptions,
  PreviousDeploymentOptions,
  getStreamById,
} from '@ehpr/common';
import { createValidator } from 'class-validator-formik';
import { contactDefaultValues } from './contact';
import { credentialDefaultValues } from './credential';
import { personalDefaultValues } from './personal';
import { CredentialInformationDTO } from './credential';
import { preferencesDefaultValues } from './preferences';

export interface SubmissionType extends SubmissionPayloadDTO {
  confirm: boolean;
}

// @todo remove DeepPartial when all form steps are implemented
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const initialSubmissionValues: DeepPartial<SubmissionType> = {
  personalInformation: personalDefaultValues,
  contactInformation: contactDefaultValues,
  credentialInformation: credentialDefaultValues,
  preferencesInformation: preferencesDefaultValues,
  confirm: false,
};

export const personalSchema = createValidator(PersonalInformationDTO);
export const contactSchema = createValidator(ContactInformationDTO);
export const credentialSchema = createValidator(CredentialInformationDTO);
export const preferencesSchema = createValidator(PreferencesInformationDTO);
export { reviewSchema } from './review';

export * from './credential';

export const prefilledSubmissionValues: SubmissionType = {
  personalInformation: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: 'A1A1A1',
  },
  contactInformation: {
    primaryPhone: '1234567890',
    primaryPhoneExt: 'dial 2 at the menu',
    email: 'johndoe@test.test',
  },
  credentialInformation: {
    stream: getStreamById('Physician').id,
    registrationStatus: RegistrationStatus.REGISTERED,
    registrationNumber: '123456789',
    specialties: [
      {
        id: getSpecialtyById(getStreamById('Physician').specialties[0]).id,
        subspecialties: [
          getSubSpecialtyById(
            getSpecialtyById(getStreamById('Physician').specialties[0]).subspecialties[0],
          ),
        ],
      },
    ],
    currentEmployment: EmploymentTypes.HEALTH_SECTOR_EMPLOYED,
    healthAuthorities: [HealthAuthorities.INTERIOR],
  },
  preferencesInformation: {
    deployAnywhere: true,
    placementOptions: [PlacementOptions.COVID_19_SUPPORT],
    hasImmunizationTraining: true,
    deploymentLocations: [],
    hasPreviousDeployment: PreviousDeploymentOptions.NO_OR_UNSURE,
    deploymentDuration: DeploymentDurations.EIGHT_PLUS,
    deploymentType: [DeploymentTypes.FULL_TIME],
  },
  confirm: true,
};
