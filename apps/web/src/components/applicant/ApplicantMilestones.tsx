import { useEffect, useState } from 'react';

import { StatusCategory } from '@ien/common';
import historyIcon from '@assets/img/history.svg';
import { StatusCategoryTab } from '../display/StatusCategoryTab';
import { milestoneTabs } from '@services';
import { useApplicantContext } from './ApplicantContext';
import { MilestoneTable } from '../milestone-logs/MilestoneTable';
import { Recruitment } from '../milestone-logs/Recruitment';
import { useAuthContext } from '../AuthContexts';
import { System } from '../milestone-logs/System';
import { SystemProvider } from '../milestone-logs/system/SystemContext';

export const ApplicantMilestones = () => {
  const { applicant } = useApplicantContext();

  const { authUser } = useAuthContext();

  const [statusCategory, setStatusCategory] = useState('');

  useEffect(
    function setDefaultCategory() {
      if (!statusCategory) {
        setStatusCategory(
          (applicant?.status?.category as StatusCategory) || StatusCategory.RECRUITMENT,
        );
      }
    },
    [applicant, statusCategory],
  );

  const renderTabContent = () => {
    switch (statusCategory) {
      case StatusCategory.RECRUITMENT:
        return <Recruitment />;
      case StatusCategory.SYSTEM:
        return (
          <SystemProvider>
            <System />
          </SystemProvider>
        );
      default:
        return <MilestoneTable category={statusCategory} />;
    }
  };

  return (
    <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
      <div className='flex items-center border-b py-4'>
        <img src={historyIcon.src} alt='history icon' />
        <h2 className='ml-2 font-bold text-bcBluePrimary text-xl'>Milestones Logs</h2>
      </div>
      {!authUser?.ha_pcn_id ? (
        <>
          <StatusCategoryTab
            tabs={milestoneTabs}
            categoryIndex={statusCategory}
            onTabClick={(value: string) => setStatusCategory(value as StatusCategory)}
          />
          {renderTabContent()}
        </>
      ) : (
        <>
          <h1 className='font-bold text-2xl my-3'>Recruitment</h1>
          <Recruitment />
        </>
      )}
    </div>
  );
};
