import historyIcon from '@assets/img/history.svg';
import { HeaderTab } from '../display/HeaderTab';
import { milestoneTabs } from '@services';
import { useApplicantContext } from './ApplicantContext';
import { MilestoneTable } from '../milestone-logs/MilestoneTable';
import { Recruitment } from '../milestone-logs/Recruitment';
import { useEffect, useState } from 'react';

export const ApplicantMilestones = () => {
  const { applicant } = useApplicantContext();

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(
    function selectDefaultLandingTab() {
      if (tabIndex) return;
      const status = applicant.status?.id;
      const index = status ? +`${status}`.charAt(0) : 1;
      if (index !== tabIndex) {
        setTabIndex(index);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applicant],
  );

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
