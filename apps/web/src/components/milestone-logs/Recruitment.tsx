import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AddRecordModal } from '../display/AddRecordModal';
import { Spinner } from '../Spinner';
import { Record } from './recruitment/Record';
import { getJobAndMilestones } from '@services';
import { buttonBase, buttonColor } from '@components';

export const Recruitment: React.FC = () => {
  const router = useRouter();
  const applicantId = router.query.applicantId;
  const [isLoading, setIsLoading] = useState(false);
  const [jobRecords, setJobRecords] = useState<any[]>([]);

  useEffect(() => {
    try {
      const getJobAndMilestonesData = async (id: any) => {
        setIsLoading(true);
        const {
          data: { data },
        } = await getJobAndMilestones(id);
        setJobRecords(data);
        setIsLoading(false);
      };

      getJobAndMilestonesData(applicantId);
    } catch (e) {
      toast.error('Error retrieving job data');
    }
  }, []);

  if (isLoading) {
    return <Spinner className='h-10 my-5' />;
  }

  return (
    <>
      {jobRecords.map(job => (
        <Record key={job.job_id} job={job} />
      ))}

      <div className='border rounded bg-blue-100 flex justify-between items-center mb-4 h-12'>
        <span className='py-2 pl-5 font-bold text-xs sm:text-sm'>
          {jobRecords.length == 0 ? 'There is no record yet.' : ''} Please click on the &ldquo;Add
          Record&rdquo; button to create a new job competition.
        </span>
        <Link
          as={`/details/${applicantId}?record=add`}
          href={{
            pathname: `/details/${applicantId}`,
            query: { ...router.query, record: 'add' },
          }}
          shallow={true}
        >
          <a className={`mr-2 ${buttonColor.secondary} ${buttonBase}`}>
            <FontAwesomeIcon className='h-4 mr-2' icon={faPlusCircle}></FontAwesomeIcon>
            Add Record
          </a>
        </Link>
      </div>
      <AddRecordModal jobRecords={jobRecords} setJobRecords={setJobRecords} />
    </>
  );
};
