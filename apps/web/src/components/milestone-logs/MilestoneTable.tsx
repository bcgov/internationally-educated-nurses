import { PageOptions, Pagination } from '../Pagination';
import { useEffect, useState } from 'react';
import { ApplicantStatusAuditRO, formatDate } from '@ien/common';
import { getHumanizedDuration } from '@services';
import { useApplicantContext } from '../../applicant/ApplicantContext';

interface MilestoneTableProps {
  parentStatus: number;
}

const DEFAULT_TAB_PAGE_SIZE = 5;

export const MilestoneTable = ({ parentStatus }: MilestoneTableProps) => {
  const { milestones } = useApplicantContext();

  const [filteredMilestones, setFilteredMilestones] = useState<ApplicantStatusAuditRO[]>([]);
  const [milestonesInPage, setMilestonesInPage] = useState<ApplicantStatusAuditRO[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TAB_PAGE_SIZE);

  useEffect(
    function filterMilestones() {
      const audits =
        milestones?.filter(audit => {
          return audit.status.parent?.id === parentStatus;
        }) || [];
      setFilteredMilestones(audits);
    },
    [milestones, parentStatus],
  );

  useEffect(
    function updateMilestonesInPage() {
      if (!filteredMilestones || (pageIndex - 1) * pageSize > filteredMilestones.length) {
        setPageIndex(1);
      }
      const start = (pageIndex - 1) * pageSize;
      const end = pageIndex * pageSize;
      setMilestonesInPage(filteredMilestones?.slice(start, end) || []);
    },
    [filteredMilestones, pageIndex, pageSize],
  );

  const handlePageOptions = (options: PageOptions) => {
    setPageSize(options.pageSize);
    setPageIndex(options.pageIndex);
  };

  const getStatus = (milestone: ApplicantStatusAuditRO) => {
    const { status } = milestone.status;
    if (!status) return '';

    const label = milestone.status.party || '-';

    return (
      <div className='flex flex-row'>
        <div className='bg-bcGrayLabel px-2 py-0.5 mr-2 text-xs text-white rounded'>{label}</div>
        <div className='text-ellipsis overflow-hidden ...'>{status}</div>
      </div>
    );
  };

  const getDuration = (milestone: ApplicantStatusAuditRO): string => {
    const start = milestone.start_date;
    let end = milestone.end_date;
    if (!end) {
      const nextMilestone = milestones.filter(m => m.status.id > milestone.status.id)[0];
      if (nextMilestone) {
        end = nextMilestone.start_date;
      }
    }
    return getHumanizedDuration(start, end);
  };

  return (
    <div>
      <div className='text-bcGray pb-2'>Showing {milestones.length} logs</div>
      <div>
        <table className='w-full'>
          <thead className=''>
            <tr className='bg-bcLightGray text-bcDeepBlack text-sm text-left border-b-2 border-yellow-300'>
              <th className='py-4 pl-8' scope='col'>
                Milestones
              </th>
              <th className='px-4' scope='col'>
                Start Date
              </th>
              <th className='px-4' scope='col'>
                End Date
              </th>
              <th className='px-4' scope='col'>
                Duration
              </th>
            </tr>
          </thead>
          <tbody className='text-bcBlack'>
            {milestonesInPage.map(audit => (
              <tr
                key={audit.id}
                className='text-left text-sm even:bg-bcLightGray shadow-xs whitespace-nowrap'
              >
                <td className='pl-8 py-5 max-w-xs'>{getStatus(audit)}</td>
                <td className='px-4'>{formatDate(audit.start_date || '')}</td>
                <td className='px-4'>{formatDate(audit.end_date || '')}</td>
                <td className='px-4'>{getDuration(audit)}</td>
              </tr>
            ))}
            {!milestonesInPage.length && (
              <tr>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pageOptions={{ pageIndex, pageSize, total: milestones.length }}
        onChange={handlePageOptions}
      />
    </div>
  );
};
