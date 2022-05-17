import historyIcon from '@assets/img/history.svg';
import { HeaderTab } from '../components/display/HeaderTab';
import { milestoneTabs } from '@services';
import { useApplicantContext } from './ApplicantContext';
import { MilestoneTable } from '../components/milestone-logs/MilestoneTable';
import { Recruitment } from '../components/milestone-logs/Recruitment';

export const ApplicantMilestones = () => {
  const { currentTab, setCurrentTab, milestones } = useApplicantContext();

  const tabComponents = [
    { component: <MilestoneTable milestones={milestones} /> },
    { component: <MilestoneTable milestones={milestones} /> },
    { component: <Recruitment /> },
    { component: <MilestoneTable milestones={milestones} /> },
    { component: <MilestoneTable milestones={milestones} /> },
  ];

  return (
    <div className='border-2 rounded px-5 my-5 pb-6 bg-white'>
      <div className='flex items-center border-b py-4'>
        <img src={historyIcon.src} alt='history icon' />
        <h2 className='ml-2 font-bold text-bcBluePrimary text-xl'>Milestones Logs</h2>
      </div>
      <HeaderTab tabs={milestoneTabs} tabIndex={currentTab || 1} onTabClick={setCurrentTab} />
      {tabComponents[currentTab - 1]?.component}
    </div>
  );
};
