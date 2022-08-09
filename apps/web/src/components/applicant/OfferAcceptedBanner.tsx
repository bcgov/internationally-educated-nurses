import { Banner } from '@components';

import hiredIndCheckmark from '@assets/img/hired_checkmark_banner.svg';
import hiredIndIcon from '@assets/img/hired_indicator.svg';
import { useApplicantContext } from './ApplicantContext';
import { useAuthContext } from '../AuthContexts';

export const OfferAcceptedBanner: React.FC = () => {
  const { hiredHa } = useApplicantContext();
  const { authUser } = useAuthContext();

  if (hiredHa === authUser?.ha_pcn_id) {
    return (
      <Banner style='success' image={hiredIndCheckmark.src}>
        This applicant has already accepted your job offer and has been hired.
      </Banner>
    );
  }
  return (
    <Banner style='warning' image={hiredIndIcon.src}>
      This applicant has already accepted a job offer and has been hired to another job competition.
    </Banner>
  );
};
