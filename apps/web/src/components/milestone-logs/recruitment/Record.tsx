import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { buttonBase, buttonColor, DetailsItem, Disclosure, AclMask } from '@components';
import { AddMilestone, EditMilestone } from './Milestone';
import {
  Access,
  ApplicantJobRO,
  ApplicantStatusAuditRO,
  COMPLETED_STATUSES,
  formatDate,
  IENApplicantUpdateStatusDTO,
} from '@ien/common';
import editIcon from '@assets/img/edit.svg';
import deleteIcon from '@assets/img/trash_can.svg';
import disabledDeleteIcon from '@assets/img/disabled-trash_can.svg';
import dotIcon from '@assets/img/dot.svg';
import dotIconHired from '@assets/img/dot_green.svg';
import { AddRecordModal } from '../../display/AddRecordModal';
import { updateMilestone, getHumanizedDuration, StatusCategory } from '@services';
import { useApplicantContext } from '../../applicant/ApplicantContext';
import { useAuthContext } from 'src/components/AuthContexts';
import { DeleteJobModal } from 'src/components/display/DeleteJobModal';
import { canDelete } from 'src/utils';

interface RecordProps {
  job: ApplicantJobRO;
  expandRecord: boolean;
  jobIndex: number;
  wasOfferAccepted?: boolean;
}

export const Record: React.FC<RecordProps> = ({
  job,
  expandRecord,
  jobIndex,
  wasOfferAccepted,
}) => {
  const { applicant, updateJob, deleteJob } = useApplicantContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editing, setEditing] = useState<ApplicantStatusAuditRO | null>(null); // milestone being edited

  const { ha_pcn, job_id, job_location, job_post_date, job_title, recruiter_name, added_by } = job;

  const { authUser } = useAuthContext();

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
  }, [applicant, job]);

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
    if (record) updateJob(record);
    setModalVisible(false);
  };

  const handleUpdateMilestone = async (id: string, values: IENApplicantUpdateStatusDTO) => {
    setEditing(null);
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

  const handleDeleteJob = (jobId?: string) => {
    if (jobId) {
      deleteJob(jobId);
    }

    setDeleteModalVisible(false);
  };

  const deleteButton = () => {
    return canDelete(authUser?.user_id, added_by?.id) ? (
      <button
        className={`px-6 ml-4 border-bcRedError ${buttonBase} text-bcRedError`}
        onClick={() => setDeleteModalVisible(true)}
      >
        <img src={deleteIcon.src} alt='delete competition' className='mr-2' />
        Delete Competition
      </button>
    ) : (
      <button
        className={`cursor-not-allowed px-6 ml-4 border-bcGrayDisabled2 ${buttonBase} text-bcGrayDisabled2`}
      >
        <img src={disabledDeleteIcon.src} alt='disabled delete competition' className='mr-2' />
        Delete Competition
      </button>
    );
  };

  return (
    <div className='mb-3' data-cy={`record-${jobIndex}`}>
      <Disclosure
        shouldExpand={expandRecord}
        wasOfferAccepted={wasOfferAccepted}
        buttonText={
          <div className='rounded py-2 pl-5 w-full'>
            <div className='flex items-center'>
              <span className='font-bold text-black'>{ha_pcn.title}</span>
              <span
                className={`text-sm ${
                  wasOfferAccepted ? 'text-bcGreenHiredText' : 'text-bcBlueLink'
                } font-bold mr-3 ml-auto capitalize`}
              >
                <img
                  src={wasOfferAccepted ? dotIconHired.src : dotIcon.src}
                  alt='dot heading'
                  className='inline-block mr-2'
                />
                {getRecordStatus()}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-black '>
                {job_title?.title ? job_title?.title : 'N/A'}
                &nbsp;|&nbsp;Recruiter Name:&nbsp;
                {job.recruiter_name}
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
                title='Communities'
                text={
                  job_location?.length
                    ? job_location
                        .map(e => e?.title)
                        .sort()
                        .join(', ')
                    : 'N/A'
                }
              />

              <DetailsItem title='Recruiter Name' text={recruiter_name} />
              <DetailsItem
                title='Date Job Was First Posted'
                text={job_post_date ? formatDate(job_post_date) : 'N/A'}
              />
            </div>
            <AclMask acl={[Access.APPLICANT_WRITE]}>
              <button
                className={`px-6 mb-2 ${buttonColor.secondary} ${buttonBase}`}
                onClick={() => setModalVisible(true)}
              >
                <img src={editIcon.src} alt='edit job' className='mr-2' />
                Edit Details
              </button>
              {deleteButton()}
              <DeleteJobModal
                onClose={handleDeleteJob}
                visible={deleteModalVisible}
                userId={authUser?.user_id}
                job={job}
              />
            </AclMask>
            {milestones.map(mil => (
              <EditMilestone
                job={job}
                key={mil.id}
                milestone={mil}
                editing={editing}
                onEditing={setEditing}
                handleSubmit={values => handleUpdateMilestone(mil.id, values)}
                milestoneTabId={StatusCategory.RECRUITMENT}
              />
            ))}
            <AclMask acl={[Access.APPLICANT_WRITE]}>
              {!editing && <AddMilestone job={job} milestoneTabId={StatusCategory.RECRUITMENT} />}
              <AddRecordModal
                job={job}
                milestones={milestones}
                onClose={handleModalClose}
                visible={modalVisible}
              />
            </AclMask>
          </div>
        }
      />
    </div>
  );
};
