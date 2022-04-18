import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getApplicant, milestoneTabs, ValidRoles } from '@services';
import { HeaderTab } from 'src/components/display/HeaderTab';
import { Recruitment } from 'src/components/milestone-logs/Recruitment';
import { DetailsItem } from '@components';
import { ApplicantRO, ApplicantStatusAuditRO, formatDate } from '@ien/common';
import { Spinner } from 'src/components/Spinner';
import detailIcon from '@assets/img/details.svg';
import historyIcon from '@assets/img/history.svg';
import { MilestoneTable } from '../../components/milestone-logs/MilestoneTable';
import withAuth from 'src/components/Keycloak';

const Details = () => {
  const [applicant, setApplicant] = useState<ApplicantRO>();
  const [currentTab, setCurrentTab] = useState(1);
  const [milestones, setMilestones] = useState<ApplicantStatusAuditRO[]>([]);

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

  const filterMilestones = () => {
    const audits =
      applicant?.applicant_status_audit?.filter(audit => {
        return audit.status.id < (currentTab + 1) * 100 && audit.status.id > currentTab * 100;
      }) || [];
    setMilestones(audits);
  };

  useEffect(() => filterMilestones(), [applicant, currentTab]);

  if (!applicant) {
    return <Spinner className='h-20' />;
  }

  const logType = [
    // waiting for hmbc api for remaining 4 components
    { component: <MilestoneTable milestones={milestones} /> },
    { component: <MilestoneTable milestones={milestones} /> },
    { component: <Recruitment /> },
    { component: <MilestoneTable milestones={milestones} /> },
    { component: <MilestoneTable milestones={milestones} /> },
  ];

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4 px-4'>
      <p className='text-xs text-gray-400 mt-3 mb-5'>
        Manage Applicants / <span className='text-blue-800 font-bold'>Applicant Details</span>
      </p>
      <h1 className='font-bold text-3xl'>
        {applicant.name} #{applicant.applicant_id ? applicant.applicant_id : 'NA'}
      </h1>
      <p className='text-gray-400 text-sm pt-1 pb-4'>
        Last Updated: {formatDate(applicant.updated_date)}
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
          <DetailsItem title='Email Address' text={applicant.email_address} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Phone Number' text={applicant.phone_number} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Registration date' text={formatDate(applicant.registration_date)} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
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
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem
            title='Country of Citizenship'
            text={applicant.country_of_citizenship?.join(', ')}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Country of Residence' text={applicant.country_of_residence} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Permanent Resident Status' text={applicant.pr_status} />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='Country of Nursing Education' text='Needs to remove it' />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
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
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem title='BCCNM License Number' text={applicant.bccnm_license_number} />
        </div>
      </div>

      {/* Milestones logs container */}
      <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
        <div className='flex items-center border-b py-4'>
          <img src={historyIcon.src} alt='history icon' />
          <h2 className='ml-2 font-bold text-bcBluePrimary text-xl'>Milestones Logs</h2>
        </div>
        <HeaderTab tabs={milestoneTabs} tabIndex={currentTab} onTabClick={setCurrentTab} />
        {logType[currentTab - 1]?.component}
      </div>
    </div>
  );
};

export default withAuth(Details, [
  ValidRoles.MINISTRY_OF_HEALTH,
  ValidRoles.HEALTH_MATCH,
  ValidRoles.HEALTH_AUTHORITY,
]);
