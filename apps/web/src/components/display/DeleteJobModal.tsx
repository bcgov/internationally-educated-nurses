import React, { ChangeEvent, useState } from 'react';

import { Button } from '@components';
import { Modal } from '../Modal';
import { deleteJobRecord } from '@services';
import { ApplicantJobRO } from '@ien/common';
import { useApplicantContext } from '../applicant/ApplicantContext';

interface DeleteJobProps {
  onClose: (jobId?: number) => void;
  visible: boolean;
  userId: string | undefined | null;
  job: ApplicantJobRO;
}

export const DeleteJobModal: React.FC<DeleteJobProps> = (props: DeleteJobProps) => {
  const { visible, onClose, userId, job } = props;
  const { applicant } = useApplicantContext();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = async () => {
    await deleteJobRecord(userId, job.id);
    setConfirmDelete(false);
    onClose(job.id);
  };

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmDelete(Boolean(e.target.checked));
  };

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Delete Job Competition
      </Modal.Title>
      <div className='w-full'>
        <div className='grid grid-cols-6 gap-4 bg-white rounded px-8 pt-6 pb-7'>
          <span className='col-span-6'>You are about to delete the job competition for:</span>

          <span className='font-bold col-span-2'>Applicant Name: </span>
          <span className='col-span-4'>{applicant.name}</span>

          <span className='font-bold col-span-2'>Job ID: </span>
          <span className='col-span-4'>{job.job_id || 'N/A'}</span>

          <span className='font-bold col-span-2'>Location: </span>
          <span className='col-span-4'>
            {job.job_location && job.job_location.length > 0
              ? job.job_location?.map(l => (
                  <span key={job.id + l.title} className='block'>
                    {l.title}
                  </span>
                ))
              : 'N/A'}
          </span>
          <span className='font-bold col-span-2'>Recruiter Name: </span>
          <span className='col-span-4'>{job.recruiter_name}</span>

          <span className='font-bold col-span-2'>
            Milestones({(job.status_audit && job.status_audit.length) || '0'}):
          </span>
          <span className='col-span-4'>
            {job.status_audit && job.status_audit.length > 0
              ? job.status_audit?.map(s => (
                  <span key={job.id + s.status.status} className='block'>
                    {s.status.status}
                  </span>
                ))
              : 'N/A'}
          </span>
        </div>
        <div className='flex items-center bg-gray-100 p-3 mx-8 mb-8 rounded'>
          <input
            value={`${confirmDelete}`}
            id='confirm-job-delete'
            type='checkbox'
            className='h-6 w-6 rounded-full mr-2 mb-4'
            onChange={handleCheckChange}
          />
          <span>
            I have reviewed all of the details and confirm I want to delete this job competition.
          </span>
        </div>
        <div className='flex items-center justify-between px-8 py-5 border-t'>
          <Button variant='outline' forModal={true} type='button' onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            variant='primary'
            forModal={true}
            type='submit'
            onClick={handleSubmit}
            disabled={!confirmDelete}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
