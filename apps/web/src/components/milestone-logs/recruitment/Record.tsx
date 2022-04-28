import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { buttonBase, buttonColor, DetailsItem, Disclosure } from '@components';
import { AddMilestones, EditMilestones } from './Milestone';
import {
  ApplicantJobRO,
  ApplicantStatusAuditRO,
  formatDate,
  IENApplicantUpdateStatusDTO,
} from '@ien/common';
import editIcon from '@assets/img/edit.svg';
import dotIcon from '@assets/img/dot.svg';
import { AddRecordModal } from '../../display/AddRecordModal';
import { updateMilestone } from '@services';

interface RecordProps {
  job: ApplicantJobRO;
  update: (record?: ApplicantJobRO) => void;
}

export const Record: React.FC<RecordProps> = ({ job, update }) => {
  const router = useRouter();
  const applicantId = router.query.id as string;
  const [recordStatus, setRecordStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // set status_audit to empty array on record create
  // is not included in response when a new record gets created and only gets initialized on refresh
  // which prevents creation of milestones for new record
  const {
    ha_pcn,
    job_id,
    job_location,
    job_post_date,
    job_title,
    recruiter_name,
    status_audit = [],
  } = job;

  const [jobMilestones, setJobMilestones] = useState<ApplicantStatusAuditRO[]>(status_audit || []);

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
          : 'On Going',
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

  const handleModalClose = (record?: ApplicantJobRO) => {
    if (record) update(record);
    setModalVisible(false);
  };

  const handleUpdateMilestone = async (id: string, values: IENApplicantUpdateStatusDTO) => {
    const milestone = await updateMilestone(applicantId, id, values);
    if (milestone) {
      const index = jobMilestones.findIndex(m => m.id === id);
      if (index >= 0) jobMilestones.splice(index, 1, milestone);
      setJobMilestones([...jobMilestones]);
    }
  };

  return (
    <div className='mb-3'>
      <Disclosure
        buttonText={
          <div className='rounded py-2 pl-5 w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black'>{ha_pcn.title}</span>
              <span className='text-sm text-bcBlueLink font-bold mr-3 ml-auto capitalize'>
                <img src={dotIcon.src} alt='dot heading' className='inline-block mr-2' />
                {recordStatus || 'On going'}
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
            <button
              className={`px-6 mb-2 ${buttonColor.secondary} ${buttonBase}`}
              onClick={() => setModalVisible(true)}
            >
              <img src={editIcon.src} alt='edit' className='mr-2' />
              Edit Details
            </button>
            <AddRecordModal job={job} onClose={handleModalClose} visible={modalVisible} />
            {jobMilestones &&
              jobMilestones.map(mil => (
                <EditMilestones
                  job={job}
                  key={mil.id}
                  milestone={mil}
                  handleSubmit={values => handleUpdateMilestone(mil.id, values)}
                />
              ))}
            <AddMilestones
              applicantId={applicantId as string}
              job={job}
              setJobMilestones={setJobMilestones}
            />
          </div>
        }
      />
    </div>
  );
};
