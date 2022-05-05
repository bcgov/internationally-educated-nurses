import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { getApplicant, isoCountries, milestoneTabs, ValidRoles } from '@services';
import { HeaderTab } from 'src/components/display/HeaderTab';
import { Recruitment } from 'src/components/milestone-logs/Recruitment';
import { DetailsItem } from '@components';
import { ApplicantRO, ApplicantStatusAuditRO, formatDate } from '@ien/common';
import { Spinner } from 'src/components/Spinner';
import detailIcon from '@assets/img/details.svg';
import historyIcon from '@assets/img/history.svg';
import { MilestoneTable } from 'src/components/milestone-logs/MilestoneTable';
import withAuth from 'src/components/Keycloak';
import { IEN_EVENTS, emitter } from '@services';

// convert alpha 2 code for countries to full name
const convertCountryCode = (code: string | undefined) => {
  if (!code || !isoCountries[code as keyof typeof isoCountries]) {
    return 'N/A';
  }

  const { name } = isoCountries[code as keyof typeof isoCountries];
  return name;
};

const Details = () => {
  const [applicant, setApplicant] = useState<ApplicantRO>({} as ApplicantRO);
  const [currentTab, setCurrentTab] = useState(0);
  const [milestones, setMilestones] = useState<ApplicantStatusAuditRO[]>([]);

  const router = useRouter();
  const applicantId = router.query.id as string;

  const selectDefaultLandingTab = (status_id?: number) => {
    if (currentTab) return;
    setCurrentTab(status_id ? +`${status_id}`.charAt(0) : 1);
  };

  const fetchApplicant = async () => {
    const applicantData = await getApplicant(applicantId);
    if (applicantData) {
      setApplicant(applicantData);
    }
    selectDefaultLandingTab(applicantData?.status?.id);
  };

  useEffect(() => {
    if (router.isReady) {
      fetchApplicant();
    }
  }, [router, applicantId]);

  useEffect(() => {
    emitter.on(IEN_EVENTS.UPDATE_JOB, fetchApplicant);
    return () => {
      emitter.off(IEN_EVENTS.UPDATE_JOB, fetchApplicant);
    };
  }, []);

  const filterMilestones = () => {
    const audits =
      applicant?.applicant_status_audit?.filter(audit => {
        return audit.status.parent?.id === 10000 + currentTab;
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

  const backToApplicants = () => {
    router.back();
  };

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4 px-4'>
      <div className='text-xs mt-4 mb-5 font-bold'>
        <button onClick={backToApplicants}>
          <a className='text-bcGray hover:text-bcBlueLink hover:underline'>Manage Applicants</a>
        </button>
        <span className='mx-3'>&gt;</span>
        <span className='text-bcBlueLink'>Applicant Details</span>
      </div>
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
            text={
              applicant.country_of_citizenship &&
              Object.values(applicant.country_of_citizenship)
                .map((c: string) => convertCountryCode(c.toUpperCase()))
                .join(', ')
            }
          />
        </div>
        <div className='col-span-12 sm:col-span-6 lg:col-span-3'>
          <DetailsItem
            title='Country of Residence'
            text={convertCountryCode(applicant.country_of_residence?.toUpperCase())}
          />
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
        <HeaderTab tabs={milestoneTabs} tabIndex={currentTab || 1} onTabClick={setCurrentTab} />
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
