import { PageOptions, Pagination } from '../Pagination';
import { useEffect, useState } from 'react';
import { ApplicantStatusAuditRO, formatDate } from '@ien/common';
import { getHumanizedDuration } from '@services';

interface MilestoneTableProps {
  milestones: ApplicantStatusAuditRO[];
}

const DEFAULT_TAB_PAGE_SIZE = 5;

export const MilestoneTable = ({ milestones }: MilestoneTableProps) => {
  const [audits, setAudits] = useState<ApplicantStatusAuditRO[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TAB_PAGE_SIZE);

  useEffect(() => {
    if (!milestones || (pageIndex - 1) * pageSize > milestones.length) {
      setPageIndex(1);
    }
    const start = (pageIndex - 1) * pageSize;
    const end = pageIndex * pageSize;
    setAudits(milestones?.slice(start, end) || []);
  }, [milestones, pageIndex, pageSize]);

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
      <div className='opacity-50 pb-2'>Showing {milestones.length} logs</div>
      <div>
        <table className='w-full'>
          <thead className=''>
            <tr className='bg-bcLightGray text-bcDeepBlack text-sm text-left border-b-2 border-yellow-300'>
              <th className='py-4 pl-8'>Milestones</th>
              <th className='px-4'>Start Date</th>
              <th className='px-4'>End Date</th>
              <th className='px-4'>Duration</th>
            </tr>
          </thead>
          <tbody className='text-bcBlack'>
            {audits.map(audit => (
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
