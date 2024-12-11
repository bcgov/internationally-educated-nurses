import React from 'react';

import { Button } from '@components';
import { Modal } from '../Modal';
import { deleteApplicantStatus } from '@services';
import { useApplicantContext } from '../applicant/ApplicantContext';

interface DeleteMilestoneProps {
  onClose: (milestoneId?: string) => void;
  visible: boolean;
  userId: string | undefined | null;
  milestoneId: string;
}

export const DeleteMilestoneModal: React.FC<DeleteMilestoneProps> = (
  props: DeleteMilestoneProps,
) => {
  const { visible, onClose, userId, milestoneId } = props;
  const { fetchApplicant } = useApplicantContext();

  const handleSubmit = async () => {
    await deleteApplicantStatus(userId, milestoneId);
    fetchApplicant();
    onClose(milestoneId);
  };

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Delete Milestone
      </Modal.Title>
      <div className='w-full'>
        <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7'>
          <span className='text-md font-bold col-span-4 my-2'>
            Are you sure you want to delete this Milestone?
          </span>
          <div className='col-span-4 flex items-center justify-between'>
            <Button variant='outline' forModal={true} type='button' onClick={() => onClose()}>
              Cancel
            </Button>
            <Button variant='primary' forModal={true} type='submit' onClick={handleSubmit}>
              Yes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
