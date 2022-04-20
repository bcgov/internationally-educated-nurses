import { faCircle, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { buttonBase, buttonColor, DetailsItem, Disclosure } from '@components';
import { AddMilestones, EditMilestones } from './Milestone';
import { ApplicantJobRO, formatDate } from '@ien/common';

interface RecordProps {
  job: ApplicantJobRO;
}

export const Record: React.FC<RecordProps> = ({ job }) => {
  const router = useRouter();
  const applicantId = router.query.applicantId;
  const [recordStatus, setRecordStatus] = useState('');

  // set status_audit to empty array on record create
  // is not included in response when a new record gets created and only gets initialized on refresh
  // which prevents creation of milestones for new record
  const {
    id,
    ha_pcn,
    job_id,
    job_location,
    job_post_date,
    job_title,
    recruiter_name,
    status_audit = [],
  } = job;

  const [jobMilestones, setJobMilestones] = useState(status_audit);

  // @todo - remove hard coded values
  const completionIdArray = [305, 306, 307, 308];

  useEffect(() => {
    if (jobMilestones) {
      lastMilestones();
    }
  }, [jobMilestones]);

  // set status for Record, returns in ASC, need to grab last item in array
  const lastMilestones = () => {
    if (jobMilestones) {
      if (jobMilestones[jobMilestones.length - 1] === undefined) {
        return;
      }

      const lastItem = jobMilestones.length - 1;
      const statusId = jobMilestones[lastItem].status.id;

      setRecordStatus(
        completionIdArray.includes(statusId)
          ? 'Complete - ' + jobMilestones[lastItem].status.status
          : jobMilestones[lastItem].status.status,
      );
    }
  };

  // get duration difference between previous milestones start date and new milestones start date
  const getMilestoneDuration = () => {
    dayjs.extend(duration);
    dayjs.extend(relativeTime);

    let endDate = new Date();

    if (jobMilestones) {
      const lastItem = jobMilestones.length - 1;

      if (jobMilestones.length > 1) {
        endDate = jobMilestones[lastItem - 1].start_date as Date;
      }

      const prevDate = dayjs(endDate);
      const newDate = dayjs(jobMilestones[lastItem].start_date);
      const dur = dayjs.duration(prevDate.diff(newDate)).humanize();

      return dur;
    }
    return;
  };

  return (
    <div className='mb-3'>
      <Disclosure
        buttonText={
          <div className='bg-blue-100 rounded py-2 pl-5 w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black'>{ha_pcn.title}</span>
              <span className='text-xs text-blue-700 font-bold mr-3 ml-auto capitalize'>
                <FontAwesomeIcon
                  icon={faCircle}
                  className='text-blue-700 h-2 inline-block mb-0.5 mr-1'
                />
                {recordStatus ? recordStatus : 'On Going'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-black '>{job_title.title}</span>
              <span className='text-xs text-black mr-3 capitalize'>
                {jobMilestones && jobMilestones.length > 0 && getMilestoneDuration()}
              </span>
            </div>
          </div>
        }
        content={
          <div className='px-5 mb-3'>
            <div className='flex justify-between'>
              <DetailsItem title='Job ID' text={job_id} />
              <DetailsItem title='Location' text={job_location.title} />

              <DetailsItem title='Recruiter Name' text={recruiter_name} />
              <DetailsItem title='Date Job Was First Posted' text={formatDate(job_post_date)} />
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
              applicantId={applicantId as string}
              jobId={id}
              setJobMilestones={setJobMilestones}
            />
          </div>
        }
      />
    </div>
  );
};
