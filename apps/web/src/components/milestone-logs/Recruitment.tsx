import { buttonBase, buttonColor } from '@components';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { AddRecordModal } from '../display/AddRecordModal';
import { Record } from './recruitment/Record';

interface RecruitmentProps {
  jobs: any[];
}

export const Recruitment: React.FC<RecruitmentProps> = ({ jobs }) => {
  const router = useRouter();
  const applicantId = router.query.applicantId;

  const [jobRecords, setJobRecords] = useState<any[]>(jobs);

  return (
    <>
      {jobRecords.map(job => (
        <Record key={job.job_id} job={job} />
      ))}

      <div className='border rounded bg-blue-100 flex justify-between items-center mb-4 h-12'>
        <span className='py-2 pl-5 font-bold text-xs sm:text-sm'>
          There is no record yet. Please click on the &ldquo;Add Record&rdquo; button to create a
          new job competition.
        </span>
        <Link
          as={`/details/${applicantId}?record=add`}
          href={{
            pathname: `/details/${applicantId}`,
            query: { ...router.query, record: 'add' },
          }}
          shallow={true}
        >
          <a className={`ml-auto mr-2 ${buttonColor.secondary} ${buttonBase}`}>
            <FontAwesomeIcon className='h-4 mr-2' icon={faPlusCircle}></FontAwesomeIcon>
            Add Record
          </a>
        </Link>
      </div>
      <AddRecordModal jobRecords={jobRecords} setJobRecords={setJobRecords} />
    </>
  );
};
