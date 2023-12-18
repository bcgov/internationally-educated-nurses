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
