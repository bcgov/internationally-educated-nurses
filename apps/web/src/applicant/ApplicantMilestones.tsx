import historyIcon from '@assets/img/history.svg';
import { HeaderTab } from '../components/display/HeaderTab';
import { milestoneTabs } from '@services';
import { useApplicantContext } from './ApplicantContext';
import { MilestoneTable } from '../components/milestone-logs/MilestoneTable';
import { Recruitment } from '../components/milestone-logs/Recruitment';
import { useEffect, useState } from 'react';

export const ApplicantMilestones = () => {
  const { applicant } = useApplicantContext();

  const [tabIndex, setTabIndex] = useState(0);

  const selectDefaultLandingTab = (status_id?: number) => {
    if (tabIndex) return;
    const index = status_id ? +`${status_id}`.charAt(0) : 1;
    if (index !== tabIndex) {
      setTabIndex(index);
    }
  };

  useEffect(() => {
    selectDefaultLandingTab(applicant.status?.id);
  }, [applicant]);

  return (
    <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
      <div className='flex items-center border-b py-4'>
        <img src={historyIcon.src} alt='history icon' />
        <h2 className='ml-2 font-bold text-bcBluePrimary text-xl'>Milestones Logs</h2>
      </div>
      <HeaderTab tabs={milestoneTabs} tabIndex={tabIndex} onTabClick={setTabIndex} />
      {tabIndex === 3 ? <Recruitment /> : <MilestoneTable parentStatus={tabIndex + 10000} />}
    </div>
  );
};
