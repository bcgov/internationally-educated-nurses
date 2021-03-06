import { useEffect, useState } from 'react';

import { AddRecordModal } from '../display/AddRecordModal';
import { Record } from './recruitment/Record';
import { Access, ApplicantJobRO, JobFilterOptions } from '@ien/common';
import {
  AclMask,
  buttonBase,
  buttonColor,
  isHired,
  JobCompetitionModal,
  PageOptions,
  Pagination,
} from '@components';
import addIcon from '@assets/img/add.svg';
import hiredIndIcon from '@assets/img/hired_indicator.svg';
import { JobFilters } from './recruitment/JobFilters';
import { useApplicantContext } from '../applicant/ApplicantContext';
import dayjs from 'dayjs';

const DEFAULT_JOB_PAGE_SIZE = 5;

export const Recruitment: React.FC = () => {
  const { applicant, updateJob } = useApplicantContext();

  const [jobRecords, setJobRecords] = useState<ApplicantJobRO[]>([]);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [jobInfoModalVisible, setJobInfoModalVisible] = useState(false);

  const [filters, setFilters] = useState<Partial<JobFilterOptions>>({});
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_JOB_PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [expandRecord, setExpandRecord] = useState(false);

  const sortJobs = (jobs?: ApplicantJobRO[] | null): void => {
    jobs?.sort((a, b) => {
      return dayjs(b.updated_date || b.created_date).diff(a.updated_date || a.created_date);
    });
  };

  useEffect(() => {
    sortJobs(applicant?.jobs);

    const jobs = applicant?.jobs
      ?.filter(
        job => !filters.ha_pcn || !filters.ha_pcn.length || filters.ha_pcn.includes(job.ha_pcn.id),
      )
      .filter(
        job =>
          !filters.job_title ||
          !filters.job_title.length ||
          (job.job_title && filters.job_title.includes(job.job_title.id)),
      )
      .slice(pageSize * (pageIndex - 1), pageSize * pageIndex);
    setJobRecords(jobs || []);

    setTotal(applicant?.jobs?.length || 0);
  }, [pageIndex, pageSize, filters, applicant]);

  const handleNewRecord = (record?: ApplicantJobRO) => {
    setRecordModalVisible(false);

    if (record) {
      updateJob(record);
    }
  };

  const closeJobCompetitionModal = () => {
    setJobInfoModalVisible(false);
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

  const isAnOfferAccepted = (job: ApplicantJobRO): boolean | undefined => {
    return job.status_audit?.some(s => isHired(s.status.id));
  };

  // get completed job competition info for modal
  const getAcceptedJobOfferInfo = (): ApplicantJobRO | undefined => {
    return applicant.jobs?.find(s => s.status_audit?.find(a => isHired(a.status.id)));
  };

  return (
    <>
      <JobFilters options={filters} update={handleFilters} />

      {getAcceptedJobOfferInfo() && (
        <div className='flex items-center bg-bcYellowBanner text-bcBrown h-14 mb-3 rounded'>
          <img src={hiredIndIcon.src} alt='add' className='mx-3 h-5' />
          This applicant has already accepted a job offer.&nbsp;
          <button
            type='button'
            onClick={() => {
              setJobInfoModalVisible(true);
            }}
            className='underline'
          >
            Click here to view the job competition.
          </button>
          <JobCompetitionModal
            job={getAcceptedJobOfferInfo()}
            onClose={closeJobCompetitionModal}
            visible={jobInfoModalVisible}
          />
        </div>
      )}
      {jobRecords.map((job, index) => (
        <Record
          key={job.id}
          job={job}
          expandRecord={expandRecord}
          jobIndex={index}
          wasOfferAccepted={isAnOfferAccepted(job)}
        />
      ))}
      <AclMask acl={[Access.APPLICANT_WRITE]}>
        <div className='border rounded bg-bcBlueBar flex justify-between items-center mb-4 h-12'>
          <span className='py-2 pl-5 font-bold text-xs sm:text-sm'>
            {jobRecords.length == 0 ? 'There is no record yet.' : ''} Please click on the &ldquo;Add
            Record&rdquo; button to create a new job competition.
          </span>
          <button
            id='add-record'
            className={`mr-2 ${buttonColor.secondary} ${buttonBase}`}
            onClick={() => setRecordModalVisible(true)}
          >
            <img src={addIcon.src} alt='add' className='mr-2' />
            <span>Add Record</span>
          </button>
        </div>
      </AclMask>
      <AddRecordModal
        onClose={handleNewRecord}
        visible={recordModalVisible}
        setExpandRecord={setExpandRecord}
      />
      <Pagination pageOptions={{ pageIndex, pageSize, total }} onChange={handlePageOptions} />
    </>
  );
};
