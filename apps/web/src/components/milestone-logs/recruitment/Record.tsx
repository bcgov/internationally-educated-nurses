import { useEffect, useState } from 'react';
import classNames from 'classnames';
import dayjs from 'dayjs';

import { DetailsItem, Disclosure, AclMask, Button } from '@components';
import {
  Access,
  ApplicantJobRO,
  ApplicantStatusAuditRO,
  COMPLETED_STATUSES,
  formatDate,
  IENApplicantUpdateStatusDTO,
  STATUS,
  StatusCategory,
} from '@ien/common';
import editIcon from '@assets/img/edit.svg';
import deleteIcon from '@assets/img/trash_can.svg';
import disabledDeleteIcon from '@assets/img/disabled-trash_can.svg';
import { AddRecordModal } from '../../display/AddRecordModal';
import { updateMilestone, getHumanizedDuration } from '@services';
import { useApplicantContext } from '../../applicant/ApplicantContext';
import { useAuthContext } from 'src/components/AuthContexts';
import { DeleteJobModal } from 'src/components/display/DeleteJobModal';
import { canDelete } from 'src/utils';
import { Milestone } from './Milestone';
import { AddMilestone } from './AddMilestone';

interface RecordProps {
  job: ApplicantJobRO;
  expandRecord: boolean;
  jobIndex: number;
}

export const Record: React.FC<RecordProps> = ({ job, expandRecord, jobIndex }) => {
  const { applicant, updateJob, fetchApplicant } = useApplicantContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editing, setEditing] = useState<ApplicantStatusAuditRO | null>(null); // milestone being edited

  const { ha_pcn, job_id, job_location, job_post_date, job_title, added_by } = job;

  const { authUser } = useAuthContext();

  // sort milestones by start_date and status id
  const getSortedMilestones = () => {
    if (!job.status_audit?.length) return [];
    const sortedMilestones = [...job.status_audit];
    sortedMilestones.sort((b, a) => {
      if (a.start_date === b.start_date) {
        return dayjs(a.updated_date).diff(b.updated_date);
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
  const getOutcomeText = () => {
    if (!milestones.length) return 'On Going';

    const status = milestones[0]?.status.status;

    if (COMPLETED_STATUSES.includes(status as STATUS)) {
      return `Complete - ${status}`;
    }
    return `On Going - ${status}`;
  };

  const getBgClass = () => {
    const status = milestones[0]?.status.status;
    if (status === STATUS.JOB_OFFER_ACCEPTED) {
      return 'bg-bcGreenHiredContainer';
    } else if (COMPLETED_STATUSES.includes(status as STATUS)) {
      return 'bg-bcYellowCream';
    } else {
      return 'bg-bcBlueBar';
    }
  };

  const getOutcomeClass = () => {
    const status = milestones[0]?.status.status;
    if (status === STATUS.JOB_OFFER_ACCEPTED) {
      return 'text-bcGreenHiredText';
    } else if (COMPLETED_STATUSES.includes(status as STATUS)) {
      return 'text-bcGray';
    } else {
      return 'text-bcBlueLink';
    }
  };

  // time passed since the last milestone only for incomplete job competitions
  const getMilestoneDuration = (): string => {
    if (!milestones.length) return '';

    const lastItem = milestones[0];

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
      fetchApplicant();
    }
  };

  const deleteButton = () => {
    const classes = 'px-6 ml-4';
    return canDelete(authUser?.user_id, added_by?.id) ? (
      <Button
        variant='outline'
        className={classNames(classes, 'border-bcRedError text-bcRedError')}
        onClick={() => setDeleteModalVisible(true)}
      >
        <img src={deleteIcon.src} alt='delete competition' className='mr-2' />
        Delete Competition
      </Button>
    ) : (
      <Button
        variant='outline'
        className={classNames(
          classes,
          'cursor-not-allowed border-bcGrayDisabled2 text-bcGrayDisabled2',
        )}
      >
        <img src={disabledDeleteIcon.src} alt='disabled delete competition' className='mr-2' />
        Delete Competition
      </Button>
    );
  };

  return (
    <div className='mb-3' data-cy={`record-${jobIndex}`}>
      <Disclosure
        shouldExpand={expandRecord}
        bgClass={getBgClass()}
        buttonText={
          <div className='rounded py-2 pl-5 w-full'>
            <div className='flex items-center align-middle'>
              <div className='font-bold text-black'>{ha_pcn?.title}</div>
              <div
                className={`text-sm flex align-middle font-bold mr-3 ml-auto ${getOutcomeClass()}`}
              >
                <span className='mr-2 text-xxs'>&#11044;</span>
                {getOutcomeText()}
              </div>
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
              <DetailsItem
                title='Date Job Was First Posted'
                text={job_post_date ? formatDate(job_post_date) : 'N/A'}
              />
            </div>
            <AclMask acl={[Access.APPLICANT_WRITE]}>
              <Button variant='outline' className='px-6 mb-2' onClick={() => setModalVisible(true)}>
                <img src={editIcon.src} alt='edit job' className='mr-2' />
                Edit Details
              </Button>
              {deleteButton()}
              <DeleteJobModal
                onClose={() => setDeleteModalVisible(false)}
                visible={deleteModalVisible}
                userId={authUser?.user_id}
                job={job}
              />
            </AclMask>
            {milestones.map(mil => (
              <Milestone
                job={job}
                key={mil.id}
                milestone={mil}
                editing={editing}
                onEditing={setEditing}
                handleSubmit={values => handleUpdateMilestone(mil.id, values)}
                category={StatusCategory.RECRUITMENT}
              />
            ))}
            <AclMask acl={[Access.APPLICANT_WRITE]}>
              {!editing && <AddMilestone job={job} category={StatusCategory.RECRUITMENT} />}
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
