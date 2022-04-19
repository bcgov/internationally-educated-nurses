import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { AddRecordModal } from '../display/AddRecordModal';
import { Spinner } from '../Spinner';
import { Record } from './recruitment/Record';
import { getJobAndMilestones } from '@services';
import { buttonBase, buttonColor } from '@components';
import { ApplicantJobRO } from '@ien/common';
import addIcon from '@assets/img/add.svg';

export const Recruitment: React.FC = () => {
  const router = useRouter();
  const applicantId = router.query.id;
  const [isLoading, setIsLoading] = useState(false);
  const [jobRecords, setJobRecords] = useState<ApplicantJobRO[]>();
  const [recordModalVisible, setRecordModalVisible] = useState(false);

  useEffect(() => {
    const getJobAndMilestonesData = async (id: string) => {
      setIsLoading(true);

      const data = await getJobAndMilestones(id);

      if (data) {
        setJobRecords(data);
      }

      setIsLoading(false);
    };

    getJobAndMilestonesData(applicantId as string);
  }, []);

  if (isLoading || !jobRecords) {
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
        <button
          className={`mr-2 ${buttonColor.secondary} ${buttonBase}`}
          onClick={() => setRecordModalVisible(true)}
        >
          <img src={addIcon.src} alt='add' className='mr-2' />
          <span>Add Record</span>
        </button>
      </div>
      <AddRecordModal
        jobRecords={jobRecords}
        setJobRecords={setJobRecords}
        close={() => setRecordModalVisible(false)}
        visible={recordModalVisible}
      />
    </>
  );
};
