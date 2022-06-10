import { formatDate } from '@ien/common';
import detailIcon from '@assets/img/details.svg';
import { DetailsItem } from '@components';
import { useRouter } from 'next/router';
import { useApplicantContext } from './ApplicantContext';
import { convertCountryCode } from '../services/convert-country-code';

export const ApplicantProfile = () => {
  const router = useRouter();
  const searchedByName = router.query.name;

  const { applicant } = useApplicantContext();

  return (
    <>
      <div className='text-xs mt-4 mb-5 font-bold'>
        <button onClick={() => router.back()}>
          <a className='text-bcGray hover:text-bcBlueLink hover:underline'>
            {searchedByName ? 'Search Results' : 'Manage Applicants'}
          </a>
        </button>
        <span className='mx-3'>&gt;</span>
        <span className='text-bcBlueLink'>Applicant Details</span>
      </div>
      <h1 className='font-bold text-3xl'>
        {applicant?.name} #{applicant?.applicant_id ? applicant.applicant_id : 'NA'}
      </h1>
      <p className='text-bcGray text-sm pt-1 pb-4'>
        Last Updated: {formatDate(applicant?.updated_date)}
      </p>
      {/* Details container */}
      <div className='grid grid-cols-12 gap-2 border-1 border-bcDisabled rounded px-5 pb-3 bg-white text-bcBlack'>
        <div className='col-span-12 border-b mb-3'>
          <div className='flex flex-row align-bottom py-4 font-bold'>
            <img src={detailIcon.src} alt='detail icon' />
            <h2 className='ml-2 font-bold text-xl text-bcBluePrimary'>Details</h2>
          </div>
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Email Address' text={applicant?.email_address} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Phone Number' text={applicant?.phone_number} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Registration date' text={formatDate(applicant?.registration_date)} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
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
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem
            title='Country of Citizenship'
            text={
              applicant?.country_of_citizenship &&
              Object.values(applicant?.country_of_citizenship)
                .map((c: string) => convertCountryCode(c.toUpperCase()))
                .join(', ')
            }
          />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem
            title='Country of Residence'
            text={convertCountryCode(applicant?.country_of_residence?.toUpperCase())}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Permanent Resident Status' text={applicant?.pr_status} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Country of Nursing Education' text='Needs to remove it' />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem
            title='Nursing Education'
            text={
              applicant?.nursing_educations &&
              Object.values(applicant?.nursing_educations)
                .map((a: { name: string }) => a.name)
                .join(', ')
            }
          />
        </div>
      </div>
    </>
  );
};
