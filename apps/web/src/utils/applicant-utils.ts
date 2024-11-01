import { ApplicantRO, isoCountries } from '@ien/common';

export const getApplicantEducations = (applicant: ApplicantRO): string | undefined => {
  return applicant.nursing_educations
    ?.map(e => {
      if (e.country) {
        const country = isoCountries[e.country.toUpperCase() as keyof typeof isoCountries];
        return country ? `${e.name}(${country.name})` : e.name;
      }
      return e.name;
    })
    .join(', ');
};

type Condition<T> = (option: T) => boolean;
export const createFilter = <T>(conditions: Condition<T>[]): ((option: T) => boolean) => {
  return (option: T) => conditions.every(condition => condition(option));
};
