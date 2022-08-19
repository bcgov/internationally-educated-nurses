import { Banner } from '@components';

import hiredIndCheckmark from '@assets/img/hired_checkmark_banner.svg';
import { useApplicantContext } from './ApplicantContext';
import { useAuthContext } from '../AuthContexts';

export const OfferAcceptedBanner = () => {
  const { hiredHa } = useApplicantContext();
  const { authUser } = useAuthContext();

  if (hiredHa && hiredHa === authUser?.ha_pcn_id) {
    return (
      <Banner style='success' image={hiredIndCheckmark.src}>
        This applicant has already accepted your job offer and has been hired.
      </Banner>
    );
  }
  return null;
};
