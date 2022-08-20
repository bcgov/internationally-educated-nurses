import { Banner } from '@components';

import hiredIndCheckmark from '@assets/img/hired_checkmark_banner.svg';
import { isHiredByUs } from '@ien/common';
import { useApplicantContext } from './ApplicantContext';
import { useAuthContext } from '../AuthContexts';

export const OfferAcceptedBanner = () => {
  const { applicant } = useApplicantContext();
  const { authUser } = useAuthContext();

  if (isHiredByUs(applicant, authUser)) {
    return (
      <Banner style='success' image={hiredIndCheckmark.src}>
        This applicant has already accepted your job offer and has been hired.
      </Banner>
    );
  }
  return null;
};
