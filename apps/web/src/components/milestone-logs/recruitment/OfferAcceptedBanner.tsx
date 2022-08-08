import { useApplicantContext } from 'src/components/applicant/ApplicantContext';
import hiredIndIcon from '@assets/img/hired_indicator.svg';
import hiredIndCheckmark from '@assets/img/hired_checkmark_banner.svg';
import { isHired } from '@ien/common';

export const OfferAcceptedBanner: React.FC = () => {
  const { applicant, offerWithDiffHa } = useApplicantContext();

  const defaultStyle = `flex items-center h-14 mb-5 font-bold rounded`;

  // check for an accepted offer within the same HA as current user
  const acceptedJobOfferWithSameHa = (): boolean | undefined => {
    return applicant.jobs?.some(s => s.status_audit?.find(a => isHired(a.status.id)));
  };

  // show if an offer was accepted within a different HA than logged in user
  if (offerWithDiffHa) {
    return (
      <div className={`${defaultStyle} bg-bcYellowBanner text-bcBrown`}>
        <img src={hiredIndIcon.src} alt='add' className='mx-3 h-5' />
        This applicant has already accepted a job offer and has been hired to another job
        competition.&nbsp;
      </div>
    );
    // check if applicant accepted offer within same HA as current user
  } else if (acceptedJobOfferWithSameHa()) {
    return (
      <div className={`${defaultStyle} bg-bcGreenHiredText text-white`}>
        <img src={hiredIndCheckmark.src} alt='add' className='mx-3 h-5' />
        This applicant has already accepted your job offer and has been hired.&nbsp;
      </div>
    );
  } else {
    // null if no accepted offers exist
    return null;
  }
};
