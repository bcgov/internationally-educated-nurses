import { OptionType } from '@components';
import {
  EmploymentTypes,
  HealthAuthorities,
  EmploymentCircumstances,
  RegistrationStatus,
  CredentialInformationDTO,
  getStreams,
  getSpecialtiesByStreamId,
  getSubSpecialtiesBySpecialtyId,
  StreamId,
  getStreamById,
  getSpecialtyById,
  SpecialtyId,
  SubspecialtyId,
  getSubSpecialtyById,
} from '@ehpr/common';

export { CredentialInformationDTO } from '@ehpr/common';

export const defaultSpecialtyValue = {
  id: '',
  subspecialties: [],
};

export const credentialDefaultValues: Partial<CredentialInformationDTO> = {
  stream: undefined,
  registrationStatus: undefined,
  registrationNumber: undefined,
  currentEmployment: undefined,
  specialties: [defaultSpecialtyValue],
  healthAuthorities: [],
  employmentCircumstance: undefined,
  nonClinicalJobTitle: undefined,
};

export const getStreamLabelById = (id: StreamId) => {
  const stream = getStreamById(id);
  return stream.name;
};

export const getSpecialtyLabelById = (id: SpecialtyId) => {
  const specialty = getSpecialtyById(id);
  return specialty.name;
};

export const getSubspecialtyLabelById = (id: SubspecialtyId) => {
  const subspecialty = getSubSpecialtyById(id);
  return subspecialty.name;
};

export const streamOptions = getStreams().map(({ id, name }) => ({
  value: id,
  label: name,
}));

export const getSpecialtyOptions = (streamSelection: StreamId): OptionType[] => {
  const specialties = getSpecialtiesByStreamId(streamSelection);

  return specialties.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
};

export const getSubspecialtyOptions = (specialties: string[]): Array<OptionType[] | null> => {
  const subspecialties = specialties.map(specialty => {
    const subspecialty = getSubSpecialtiesBySpecialtyId(specialty);
    if (!subspecialty) return null;
    return subspecialty.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  });

  return subspecialties;
};

export const getOptionLabelByValue = (options: OptionType[], value: string) => {
  return options.find(option => option.value === value)?.label;
};

export const registrationStatusOptions = [
  { value: RegistrationStatus.REGISTERED, label: 'Registered in good standing' },
  { value: RegistrationStatus.TEMP, label: 'Temporary emergency registrant' },
  { value: RegistrationStatus.NOT_REGISTERED, label: 'Unregistered' },
  {
    value: RegistrationStatus.NA,
    label: 'Not applicable (i.e., you/your profession does not have a regulatory body)',
  },
];

export const employmentOptions: OptionType[] = [
  {
    label: 'Employed in the health sector',
    value: EmploymentTypes.HEALTH_SECTOR_EMPLOYED,
  },
  {
    label: 'Practicum/residency in the health sector',
    value: EmploymentTypes.HEALTH_SECTORY_RESIDENCY,
  },
  {
    label: 'Not currently employed in the health sector',
    value: EmploymentTypes.NOT_HEALTH_SECTOR_EMPLOYED,
  },
];

export const healthAuthorityOptions = [
  {
    value: HealthAuthorities.FIRST_NATIONS_HA,
    label: 'First Nations Health Authority',
  },
  {
    value: HealthAuthorities.PROVIDENCE,
    label: 'Providence Health Care',
  },
  {
    value: HealthAuthorities.PROVINCIAL_HSA,
    label: 'Provincial Health Services Authority',
  },
  {
    value: HealthAuthorities.FRASER,
    label: 'Fraser Health',
  },
  {
    value: HealthAuthorities.INTERIOR,
    label: 'Interior Health',
  },
  {
    value: HealthAuthorities.VANCOUVER_ISLAND,
    label: 'Island Health',
  },
  {
    value: HealthAuthorities.NORTHEREN,
    label: 'Northern Health',
  },
  {
    value: HealthAuthorities.VANCOUVER_COASTAL,
    label: 'Vancouver Coastal Health',
  },
  {
    value: HealthAuthorities.PRIVATE_EMPLOYER,
    label: 'Private employer',
  },
  {
    value: HealthAuthorities.OUTSIDE_BC,
    label: 'Outside of BC',
  },
];

export const employmentCircumstanceOptions = [
  {
    value: EmploymentCircumstances.RETIRED,
    label: 'Retired',
  },
  {
    value: EmploymentCircumstances.STUDENT,
    label: 'Student',
  },
  {
    value: EmploymentCircumstances.OTHER,
    label: 'Other',
  },
];
