import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { buttonBase, buttonColor, DetailsItem, Disclosure } from '@components';
import { AddMilestone, EditMilestone } from './Milestone';
import {
  ApplicantJobRO,
  COMPLETED_STATUSES,
  formatDate,
  IENApplicantUpdateStatusDTO,
} from '@ien/common';
import editIcon from '@assets/img/edit.svg';
import dotIcon from '@assets/img/dot.svg';
import { AddRecordModal } from '../../display/AddRecordModal';
import { updateMilestone, getHumanizedDuration } from '@services';
import { useApplicantContext } from '../../../applicant/ApplicantContext';

interface RecordProps {
  job: ApplicantJobRO;
  update: (record?: ApplicantJobRO) => void;
  expandRecord: boolean;
}

export const Record: React.FC<RecordProps> = ({ job, update, expandRecord }) => {
  const { applicant, updateJob } = useApplicantContext();
  const [modalVisible, setModalVisible] = useState(false);

  // set status_audit to empty array on record create
  // is not included in response when a new record gets created and only gets initialized on refresh
  // which prevents creation of milestones for new record
  const { ha_pcn, job_id, job_location, job_post_date, job_title, recruiter_name } = job;

  // sort milestones by start_date and status id
  const getSortedMilestones = () => {
    if (!job.status_audit?.length) return [];
    const sortedMilestones = [...job.status_audit];
    sortedMilestones.sort((a, b) => {
      if (a.start_date === b.start_date) {
        return a.status.id - b.status.id;
      }
      return dayjs(a.start_date).diff(b.start_date);
    });
    return sortedMilestones;
  };

  const [milestones, setMilestones] = useState(getSortedMilestones());

  useEffect(() => {
    setMilestones(getSortedMilestones());
    // eslint-disable-next-line
  }, [job]);

  // set status for Record, returns in ASC, need to grab last item in array
  const getRecordStatus = () => {
    if (!milestones.length) return 'On Going';

    const lastMilestone = milestones[milestones.length - 1];
    const { id, status } = lastMilestone.status;

    const done = COMPLETED_STATUSES.includes(id);
    return `${done ? 'Complete - ' : 'On Going - '} ${status}`;
  };

  // time passed since the last milestone only for incomplete job competitions
  const getMilestoneDuration = (): string => {
    if (!milestones.length) return '';

    const lastItem = milestones[milestones.length - 1];

    if (`${lastItem.start_date}` === dayjs().format('YYYY-MM-DD')) {
      return 'Today';
    }
    return getHumanizedDuration(lastItem.start_date, dayjs().format('YYYY-MM-DD'));
  };

  const handleModalClose = (record?: ApplicantJobRO) => {
    if (record) update(record);
    setModalVisible(false);
  };

  const handleUpdateMilestone = async (id: string, values: IENApplicantUpdateStatusDTO) => {
    const milestone = await updateMilestone(applicant.id, id, values);
    if (milestone) {
      const index = job.status_audit?.findIndex(m => m.id === id);
      if (index !== undefined && index >= 0) {
        const audits = [...(job.status_audit || [])];
        audits.splice(index, 1, milestone);
        updateJob({ ...job, status_audit: audits });
      }
    }
  };

  return (
    <div className='mb-3'>
      <Disclosure
        shouldExpand={expandRecord}
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
              <span className='text-sm text-black '>
                {job_title?.title ? job_title?.title : 'N/A'}
              </span>
              <span className='text-xs text-black mr-3 capitalize'>
                {milestones && milestones.length > 0 && getMilestoneDuration()}
              </span>
            </div>
          </div>
        }
        content={
          <div className='px-5 mb-3'>
            <div className='flex justify-between'>
              <DetailsItem title='Job ID' text={job_id ? job_id : 'N/A'} />
              <DetailsItem
                title='Location'
                text={job_location?.title ? job_location?.title : 'N/A'}
              />

              <DetailsItem title='Recruiter Name' text={recruiter_name} />
              <DetailsItem
                title='Date Job Was First Posted'
                text={job_post_date ? formatDate(job_post_date) : 'N/A'}
              />
            </div>
            <button
              className={`px-6 mb-2 ${buttonColor.secondary} ${buttonBase}`}
              onClick={() => setModalVisible(true)}
            >
              <img src={editIcon.src} alt='edit' className='mr-2' />
              Edit Details
            </button>
            {milestones.map(mil => (
              <EditMilestone
                job={job}
                key={mil.id}
                milestone={mil}
                handleSubmit={values => handleUpdateMilestone(mil.id, values)}
              />
            ))}
            <AddMilestone job={job} />
            <AddRecordModal
              job={job}
              milestones={milestones}
              onClose={handleModalClose}
              visible={modalVisible}
            />
          </div>
        }
      />
    </div>
  );
};
