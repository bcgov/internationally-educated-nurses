import { useState } from 'react';
import { formatDate } from '@ien/common';
import { DetailsItem } from '@components';
import { updateApplicantActiveFlag } from '@services';
import { useApplicantContext } from './ApplicantContext';
import { convertCountryCode } from '../../services/convert-country-code';
import { DetailsHeader } from '../DetailsHeader';
import { OfferAcceptedBanner } from './OfferAcceptedBanner';
import { ToggleSwitch } from '../ToggleSwitch';

export const ApplicantProfile = () => {
  const { applicant, fetchApplicant } = useApplicantContext();
  const [activeToggle, setActiveToggle] = useState(applicant?.is_active);

  const handleChange = async (flag: boolean) => {
    const updatedApplicant = await updateApplicantActiveFlag(applicant.id, flag);

    if (updatedApplicant) {
      fetchApplicant();
    }
    setActiveToggle(flag);
  };

  return (
    <>
      <h1 className='font-bold text-3xl'>
        {applicant?.name} #{(applicant?.ats1_id || applicant?.id || 'NA').substring(0, 8)}
      </h1>
      <div className='flex justify-between'>
        <p className='text-bcGray text-sm pt-1 pb-4'>
          Last Updated: {formatDate(applicant?.updated_date)}
        </p>
        <div className='text-bcGray text-sm pt-1 pb-4 flex items-center' data-cy='active-toggle'>
          <span className='mr-2 font-bold' data-cy='active-text'>
            {applicant?.is_active ? 'Active' : 'Inactive'}
          </span>
          <ToggleSwitch
            checked={activeToggle}
            screenReaderText='Applicant Active/ Inactive Flag'
            onChange={() => handleChange(!applicant?.is_active)}
          />
        </div>
      </div>
      {/* Offer Accepted Banner */}
      <OfferAcceptedBanner />
      {/* Details container */}
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
          <DetailsItem title='Immigration Status' text={applicant?.pr_status} />
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
