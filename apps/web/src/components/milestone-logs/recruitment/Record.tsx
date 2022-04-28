import { useRouter } from 'next/router';
import { useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

import { buttonBase, buttonColor, DetailsItem, Disclosure } from '@components';
import { AddMilestone, EditMilestone } from './Milestone';
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
import { emitter, IEN_EVENTS } from '../../../services/event-emitter';

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface RecordProps {
  job: ApplicantJobRO;
  update: (record?: ApplicantJobRO) => void;
}

const COMPLETE_STATUSES = [305, 306, 307, 308];

export const Record: React.FC<RecordProps> = ({ job, update }) => {
  const router = useRouter();
  const applicantId = router.query.id as string;
  const [modalVisible, setModalVisible] = useState(false);

  // set status_audit to empty array on record create
  // is not included in response when a new record gets created and only gets initialized on refresh
  // which prevents creation of milestones for new record
  const { ha_pcn, job_id, job_location, job_post_date, job_title, recruiter_name, status_audit } =
    job;

  // sort milestones by start_date and status id
  const getSortedMilestones = (milestones: ApplicantStatusAuditRO[]) => {
    if (!milestones?.length) return [];
    const sortedMilestones = [...milestones];
    sortedMilestones.sort((a, b) => {
      if (a.start_date === b.start_date) {
        return a.status.id - b.status.id;
      }
      return dayjs(a.start_date).diff(b.start_date);
    });
    return sortedMilestones;
  };

  const [jobMilestones, setJobMilestones] = useState<ApplicantStatusAuditRO[]>(
    getSortedMilestones(status_audit || []),
  );

  // set status for Record, returns in ASC, need to grab last item in array
  const getRecordStatus = () => {
    if (!jobMilestones.length) return;

    const lastMilestone = jobMilestones[jobMilestones.length - 1];
    const { id, status } = lastMilestone.status;

    const done = COMPLETE_STATUSES.includes(id);
    return `${done ? 'Complete - ' : 'On Going - '} ${status}`;
  };

  // time passed since the last milestone only for incomplete job competitions
  const getMilestoneDuration = (): string => {
    if (!jobMilestones.length) return '';

    const lastItem = jobMilestones[jobMilestones.length - 1];

    return dayjs.duration(dayjs(lastItem.start_date).diff(new Date())).humanize();
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
      setJobMilestones(getSortedMilestones(jobMilestones));
      emitter.emit(IEN_EVENTS.UPDATE_JOB);
    }
  };

  const handleNewMilestones = (milestones: ApplicantStatusAuditRO[]) => {
    setJobMilestones(getSortedMilestones(milestones));
    emitter.emit(IEN_EVENTS.UPDATE_JOB);
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
                {getRecordStatus()}
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
            {jobMilestones.map(mil => (
              <EditMilestone
                job={job}
                key={mil.id}
                milestone={mil}
                handleSubmit={values => handleUpdateMilestone(mil.id, values)}
              />
            ))}
            <AddMilestone
              applicantId={applicantId as string}
              job={job}
              setJobMilestones={handleNewMilestones}
            />
            <AddRecordModal job={job} onClose={handleModalClose} visible={modalVisible} />
          </div>
        }
      />
    </div>
  );
};
