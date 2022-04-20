import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { AddRecordModal } from '../display/AddRecordModal';
import { Spinner } from '../Spinner';
import { Record } from './recruitment/Record';
import { getJobAndMilestones } from '@services';
import { buttonBase, buttonColor } from '@components';
import { ApplicantJobRO } from '@ien/common';
import addIcon from '@assets/img/add.svg';
import { JobFilterOptions, JobFilters } from './recruitment/JobFilters';
import { PageOptions, Pagination } from '../Pagination';

const DEFAULT_JOB_PAGE_SIZE = 5;

export const Recruitment: React.FC = () => {
  const router = useRouter();
  const applicantId = router.query.id;
  const [isLoading, setIsLoading] = useState(false);
  const [jobRecords, setJobRecords] = useState<ApplicantJobRO[]>([]);
  const [recordModalVisible, setRecordModalVisible] = useState(false);

  const [filters, setFilters] = useState<Partial<JobFilterOptions>>({});
  const [pageOptions, setPageOptions] = useState<PageOptions>({
    pageIndex: 1,
    pageSize: DEFAULT_JOB_PAGE_SIZE,
    total: 0,
  });

  useEffect(() => {
    const getJobAndMilestonesData = async (id: string) => {
      setIsLoading(true);

      const data = await getJobAndMilestones(id, { ...filters, ...pageOptions });

      if (data) {
        setJobRecords(data);
      }

      setIsLoading(false);
    };

    getJobAndMilestonesData(applicantId as string);
  }, [pageOptions, filters]);

  if (isLoading || !jobRecords) {
    return <Spinner className='h-10 my-5' />;
  }

  const handleNewRecord = (record?: ApplicantJobRO) => {
    setRecordModalVisible(false);

    if (record) {
      setJobRecords([...jobRecords, record]);
    }
  };

  const handleRecordUpdate = (record?: ApplicantJobRO) => {
    if (record) {
      const index = jobRecords.findIndex(job => job.id === record.id);
      if (index >= 0) {
        jobRecords.splice(index, 1, record);
        setJobRecords([...jobRecords]);
      }
    }
  };

  return (
    <>
      <JobFilters options={filters} update={setFilters} />

      {jobRecords.map(job => (
        <Record key={job.job_id} job={job} update={handleRecordUpdate} />
      ))}

      <div className='border rounded bg-blue-100 flex justify-between items-center mb-4 h-12'>
        <span className='py-2 pl-5 font-bold text-xs sm:text-sm'>
          {jobRecords.length == 0 ? 'There is no record yet.' : ''} Please click on the &ldquo;Add
          Record&rdquo; button to create a new job competition.
        </span>
        <button
          className={`mr-2 ${buttonColor.secondary} ${buttonBase}`}
          onClick={() => setRecordModalVisible(true)}
        >
          <img src={addIcon.src} alt='add' className='mr-2' />
          <span>Add Record</span>
        </button>
      </div>
      <AddRecordModal onClose={handleNewRecord} visible={recordModalVisible} />

      <Pagination
        pageOptions={{ ...pageOptions, total: jobRecords.length }}
        onChange={setPageOptions}
      />
    </>
  );
};
