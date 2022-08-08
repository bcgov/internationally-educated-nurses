import { formatDate, isHired } from '@ien/common';
import { DetailsItem, OfferAcceptedBanner } from '@components';
import { useApplicantContext } from './ApplicantContext';
import { convertCountryCode } from '../../services/convert-country-code';
import { DetailsHeader } from '../DetailsHeader';
import hiredIndIcon from '@assets/img/hired_indicator.svg';
import hiredIndCheckmark from '@assets/img/hired_checkmark_banner.svg';

export const ApplicantProfile = () => {
  const { applicant, offerWithDiffHa } = useApplicantContext();

  // check for an accepted offer within the same HA as current user
  const acceptedJobOfferWithSameHa = (): boolean | undefined => {
    return applicant.jobs?.some(s => s.status_audit?.find(a => isHired(a.status.id)));
  };

  const showHiredBanner = () => {
    // show if an offer was accepted within a different HA than logged in user
    if (offerWithDiffHa) {
      return (
        <OfferAcceptedBanner className='bg-bcYellowBanner text-bcBrown'>
          <img src={hiredIndIcon.src} alt='add' className='mx-3 h-5' />
          This applicant has already accepted a job offer and has been hired to another job
          competition.&nbsp;
        </OfferAcceptedBanner>
      );
      // check if applicant accepted offer within same HA as current user
    } else if (acceptedJobOfferWithSameHa()) {
      return (
        <OfferAcceptedBanner className='bg-bcGreenHiredText text-white'>
          <img src={hiredIndCheckmark.src} alt='add' className='mx-3 h-5' />
          This applicant has already accepted your job offer and has been hired.&nbsp;
        </OfferAcceptedBanner>
      );
    } else {
      // null if no accepted offers exist
      return null;
    }
  };

  return (
    <>
      <h1 className='font-bold text-3xl'>
        {applicant?.name} #{applicant?.applicant_id ? applicant.applicant_id : 'NA'}
      </h1>
      <p className='text-bcGray text-sm pt-1 pb-4'>
        Last Updated: {formatDate(applicant?.updated_date)}
      </p>
      {/* Details container */}
      {showHiredBanner()}
      <div className='border-1 border-bcDisabled rounded px-5 pb-3 bg-white text-bcBlack'>
        <DetailsHeader />
        <div className='grid grid-cols-12 gap-2 py-2'>
          <DetailsItem title='Email Address' text={applicant?.email_address} />
          <DetailsItem title='Phone Number' text={applicant?.phone_number} />
          <DetailsItem title='Registration date' text={formatDate(applicant?.registration_date)} />
          <DetailsItem
            title='Assigned To'
            text={
              applicant?.assigned_to
                ? Object.values(applicant?.assigned_to)
                    .map((a: { name: string }) => a.name)
                    .join(', ')
                : 'NA'
            }
          />
          <DetailsItem
            title='Country of Citizenship'
            text={
              applicant?.country_of_citizenship &&
              Object.values(applicant?.country_of_citizenship)
                .map((c: string) => convertCountryCode(c.toUpperCase()))
                .join(', ')
            }
          />
          <DetailsItem
            title='Country of Residence'
            text={convertCountryCode(applicant?.country_of_residence?.toUpperCase())}
          />
          <DetailsItem title='Permanent Resident Status' text={applicant?.pr_status} />
          <DetailsItem title='Country of Nursing Education' text='Needs to remove it' />
          <DetailsItem
            title='Nursing Education'
            text={
              applicant?.nursing_educations &&
              applicant?.nursing_educations
                .filter(e => e.name !== '')
                .map(n => n.name)
                .join(', ')
            }
          />
        </div>
      </div>
    </>
  );
};
