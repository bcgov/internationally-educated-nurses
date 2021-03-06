import historyIcon from '@assets/img/history.svg';
import { StatusCategoryTab } from '../display/StatusCategoryTab';
import { milestoneTabs, StatusCategory } from '@services';
import { useApplicantContext } from './ApplicantContext';
import { MilestoneTable } from '../milestone-logs/MilestoneTable';
import { Recruitment } from '../milestone-logs/Recruitment';
import { useEffect, useState } from 'react';

export const ApplicantMilestones = () => {
  const { applicant } = useApplicantContext();

  const [statusCategory, setStatusCategory] = useState(0);

  useEffect(
    function setDefaultCategory() {
      if (!statusCategory) {
        setStatusCategory(applicant.status?.parent?.id || StatusCategory.INTAKE);
      }
    },
    [applicant, statusCategory],
  );

  return (
    <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
      <div className='flex items-center border-b py-4'>
        <img src={historyIcon.src} alt='history icon' />
        <h2 className='ml-2 font-bold text-bcBluePrimary text-xl'>Milestones Logs</h2>
      </div>
      <StatusCategoryTab
        tabs={milestoneTabs}
        categoryIndex={statusCategory}
        onTabClick={setStatusCategory}
      />
      {statusCategory === StatusCategory.RECRUITMENT ? (
        <Recruitment />
      ) : (
        <MilestoneTable category={statusCategory} />
      )}
    </div>
  );
};
