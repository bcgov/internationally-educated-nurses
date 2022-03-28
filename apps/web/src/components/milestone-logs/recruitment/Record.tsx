import { faCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { buttonBase, buttonColor, DetailsItem, Disclosure } from '@components';
import { AddMilestones, EditMilestones } from './Milestone';
import { useEffect, useState } from 'react';
import { formatDate } from '@ien/common';

interface RecordProps {
  job: {
    id: string;
    ha_pcn: { title: string };
    job_id: string;
    job_location: { title: string };
    job_post_date: Date;
    job_title: { title: string };
    recruiter_name: string;
    status_audit?: any[];
  };
}

export const Record: React.FC<RecordProps> = ({ job }) => {
  const router = useRouter();
  const applicantId = router.query.applicantId;
  const [recordStatus, setRecordStatus] = useState('');

  const {
    id,
    ha_pcn,
    job_id,
    job_location,
    job_post_date,
    job_title,
    recruiter_name,
    status_audit,
  } = job;

  const [jobMilestones, setJobMilestones] = useState(status_audit);

  useEffect(() => {
    if (jobMilestones) {
      lastMilestones();
    }
  }, [jobMilestones]);

  const lastMilestones = () => {
    if (jobMilestones) {
      if (jobMilestones[0] === undefined) {
        return;
      }
      setRecordStatus(jobMilestones[0].status.status);
    }
  };

  return (
    <div className='mb-3'>
      <Disclosure
        buttonText={
          <div className='bg-blue-100 rounded py-2 pl-5 w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black'>{ha_pcn.title}</span>
              <span className='text-xs text-blue-500 font-bold mr-3 ml-auto'>
                <FontAwesomeIcon
                  icon={faCircle}
                  className='text-blue-500 h-2 inline-block mb-0.5 mr-1'
                />
                {recordStatus ? recordStatus : 'On Going'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-black '>{job_title.title}</span>
              <span className='text-xs text-black mr-3'>1 month</span>
            </div>
          </div>
        }
        content={
          <div className='px-5 mb-3'>
            <div className='flex justify-between'>
              <DetailsItem title='Job ID' text={job_id} />
              <DetailsItem title='Location' text={job_location.title} />

              <DetailsItem title='Recruiter Name' text={recruiter_name} />
              <DetailsItem
                title='Date Job Was First Posted'
                text={formatDate(job_post_date.toString())}
              />
            </div>
            <Link
              as={`/details/${applicantId}?recruitment=edit`}
              href={{
                pathname: `/details/${applicantId}`,
                query: { ...router.query, recruitment: 'edit' },
              }}
              shallow={true}
            >
              <a className={`px-6 mb-2 ${buttonColor.secondary} ${buttonBase} pointer-events-none`}>
                <FontAwesomeIcon className='h-4 mr-2' icon={faPencilAlt}></FontAwesomeIcon>
                Edit Details
              </a>
            </Link>
            {jobMilestones &&
              jobMilestones.map(mil => <EditMilestones key={mil.id} milestones={mil} />)}
            <AddMilestones
              applicantId={applicantId}
              jobId={id}
              jobMilestones={jobMilestones}
              setJobMilestones={setJobMilestones}
            />
          </div>
        }
      />
    </div>
  );
};
