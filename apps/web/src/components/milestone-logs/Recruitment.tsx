import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { AddRecordModal } from '../display/AddRecordModal';
import { Spinner } from '../Spinner';
import { Record } from './recruitment/Record';
import { getJobAndMilestones, getJobRecord, emitter, IEN_EVENTS } from '@services';
import { buttonBase, buttonColor } from '@components';
import { ApplicantJobRO, JobFilterOptions } from '@ien/common';
import addIcon from '@assets/img/add.svg';
import { JobFilters } from './recruitment/JobFilters';
import { PageOptions, Pagination } from '../Pagination';

const DEFAULT_JOB_PAGE_SIZE = 5;

export const Recruitment: React.FC = () => {
  const router = useRouter();
  const applicantId = router.query.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [jobRecords, setJobRecords] = useState<ApplicantJobRO[]>([]);
  const [recordModalVisible, setRecordModalVisible] = useState(false);

  const [filters, setFilters] = useState<Partial<JobFilterOptions>>({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_JOB_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [expandRecord, setExpandRecord] = useState(false);

  const getJobAndMilestonesData = async (id: string) => {
    setIsLoading(true);

    const data = await getJobAndMilestones(id, {
      ...filters,
      skip: total <= pageSize ? 0 : (pageIndex - 1) * pageSize,
      limit: pageSize,
    });

    if (data) {
      const [jobs, totalCount] = data;
      setJobRecords(jobs);
      setTotal(totalCount);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getJobAndMilestonesData(applicantId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, filters]);

  const fetchJob = async (job_id: number) => {
    if (!job_id) return;

    const job = await getJobRecord(job_id);
    if (job) {
      const index = jobRecords.findIndex(j => j.id === job.id);
      if (index >= 0) {
        jobRecords.splice(index, 1, job);
        setJobRecords([...jobRecords]);
      }
    }
  };

  useEffect(() => {
    emitter.on(IEN_EVENTS.UPDATE_JOB, fetchJob);
    return () => {
      emitter.off(IEN_EVENTS.UPDATE_JOB, fetchJob);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNewRecord = (record?: ApplicantJobRO) => {
    setRecordModalVisible(false);

    if (record) {
      if (jobRecords.length === pageSize) {
        jobRecords.pop();
      }
      setJobRecords([record, ...jobRecords]);
      setTotal(total + 1);
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

  const handlePageOptions = (options: PageOptions) => {
    setPageIndex(options.pageIndex);
    setPageSize(options.pageSize);
    setExpandRecord(false);
  };

  const handleFilters = (filterBy: JobFilterOptions) => {
    setPageIndex(1);
    setFilters(filterBy);
    setExpandRecord(false);
  };

  return (
    <>
      <JobFilters options={filters} update={handleFilters} />

      {jobRecords.map(job => (
        <Record key={job.id} job={job} update={handleRecordUpdate} expandRecord={expandRecord} />
      ))}

      {isLoading ? (
        <Spinner className='h-10 my-5' />
      ) : (
        <div className='border rounded bg-bcBlueBar flex justify-between items-center mb-4 h-12'>
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
      )}

      <AddRecordModal
        onClose={handleNewRecord}
        visible={recordModalVisible}
        setExpandRecord={setExpandRecord}
      />

      <Pagination pageOptions={{ pageIndex, pageSize, total }} onChange={handlePageOptions} />
    </>
  );
};
