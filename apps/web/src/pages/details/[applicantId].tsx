import { faClock, faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getApplicant, milestoneTabs } from '@services';
import { HeaderTab } from 'src/components/display/HeaderTab';
import { Recruitment } from 'src/components/milestone-logs/Recruitment';
import { DetailsItem } from '@components';
import { ApplicantRO, formatDate } from '@ien/common';
import { Spinner } from 'src/components/Spinner';

const Details = () => {
  const [applicant, setApplicant] = useState<ApplicantRO>();
  const [currentTab, setCurrentTab] = useState(1);

  const router = useRouter();
  const applicantId = router.query.applicantId;

  useEffect(() => {
    if (router.isReady) {
      if (applicantId !== undefined) {
        const getApplicantData = async (id: string) => {
          const applicantData = await getApplicant(id);

          if (applicantData) {
            setApplicant(applicantData);
          }
        };

        getApplicantData(applicantId as string);
      }
    }
  }, [router, applicantId]);

  if (!applicant) {
    return <Spinner className='h-20' />;
  }

  const logType = [
    // waiting for hmbc api for remaining 4 components
    { component: <h1>Intake</h1> },
    { component: <h1>Licensing Registration</h1> },
    { component: <Recruitment /> },
    { component: <h1>BC PNP</h1> },
    { component: <h1>Final</h1> },
  ];

  return (
    <div>
      <p className='text-xs text-gray-400 mt-3 mb-5'>
        Manage Applicants / <span className='text-blue-800 font-bold'>Applicant Details</span>
      </p>
      <h1 className='font-bold text-3xl'>
        {applicant.name} #{applicant.applicant_id ? applicant.applicant_id : 'NA'}
      </h1>
      <p className='text-gray-400 text-sm pt-1 pb-4'>Last Updated: January 5, 2022</p>
      {/* Details container */}
      <div className='grid grid-cols-12 border-2 rounded px-5 pb-3 bg-white'>
        <div className='col-span-12 border-b mb-3'>
          <h1 className='text-xl text-blue-900 py-3 font-bold'>
            <FontAwesomeIcon
              className='h-5 mr-2 inline-block items-center'
              icon={faListAlt}
            ></FontAwesomeIcon>
            Details
          </h1>
        </div>
        <div className='col-span-3'>
          <DetailsItem title='Email Address' text={applicant.email_address} />
        </div>
        <div className='col-span-3'>
          <DetailsItem title='Phone Number' text={applicant.phone_number} />
        </div>
        <div className='col-span-3'>
          <DetailsItem title='Registration date' text={formatDate(applicant.registration_date)} />
        </div>
        <div className='col-span-3'>
          <DetailsItem
            title='Assigned To'
            text={
              applicant.assigned_to
                ? Object.values(applicant.assigned_to)
                    .map((a: { name: string }) => a.name)
                    .join(', ')
                : 'NA'
            }
          />
        </div>
        <div className='col-span-3'>
          <DetailsItem
            title='Country of Citizenship'
            text={applicant.country_of_citizenship?.join(', ')}
          />
        </div>
        <div className='col-span-3'>
          <DetailsItem title='Country of Residence' text={applicant.country_of_residence} />
        </div>
        <div className='col-span-3'>
          <DetailsItem title='Permanent Resident Status' text={applicant.pr_status} />
        </div>
        <div className='col-span-3'>
          <DetailsItem title='Country of Nursing Education' text='Needs to remove it' />
        </div>
        <div className='col-span-3'>
          <DetailsItem
            title='Nursing Education'
            text={
              applicant.nursing_educations &&
              Object.values(applicant.nursing_educations)
                .map((a: { name: string }) => a.name)
                .join(', ')
            }
          />
        </div>
        <div className='col-span-3'>
          <DetailsItem title='BCCNM License Number' text={applicant.bccnm_license_number} />
        </div>
      </div>

      {/* Milestones logs container */}
      <div className='border-2 rounded px-5 my-5 bg-white'>
        <div className='flex items-center border-b'>
          <FontAwesomeIcon className='h-5 mr-2 text-blue-900 ' icon={faClock}></FontAwesomeIcon>
          <h1 className='text-xl text-blue-900 py-4 font-bold'>Milestones Logs</h1>
        </div>
        <HeaderTab tabs={milestoneTabs} tabIndex={currentTab} onTabClick={setCurrentTab} />
        {logType[currentTab - 1]?.component}
      </div>
    </div>
  );
};

export default Details;
