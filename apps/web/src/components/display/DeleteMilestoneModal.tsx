import React from 'react';
import { Formik, Form as FormikForm } from 'formik';

import { Button } from '@components';
import { Modal } from '../Modal';
import { deleteApplicantStatus } from '@services';

interface DeleteMilestoneProps {
  onClose: (milestoneId?: string) => void;
  visible: boolean;
  userId: number | undefined;
  milestoneId: string;
}

export const DeleteMilestoneModal: React.FC<DeleteMilestoneProps> = (
  props: DeleteMilestoneProps,
) => {
  const { visible, onClose, userId, milestoneId } = props;

  const handleSubmit = async () => {
    await deleteApplicantStatus(userId, milestoneId);
    onClose(milestoneId);
  };

  const initialValues: any = {
    yes: 'hi',
  };

  return (
    <Modal open={visible} handleClose={() => void 0}>
      <Modal.Title as='h1' className='text-lg font-bold leading-6 text-bcBlueLink border-b p-4'>
        Delete Milestone
      </Modal.Title>
      <div className='w-full'>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <FormikForm>
              <div className='grid grid-cols-4 gap-4 bg-white rounded px-8 pt-6 pb-7'>
                <span className='text-md font-bold col-span-4 my-2'>
                  Are you sure you want to delete this Milestone?
                </span>
                <div className='col-span-4 flex items-center justify-between'>
                  <Button variant='outline' forModal={true} type='button' onClick={() => onClose()}>
                    Cancel
                  </Button>
                  <Button
                    variant='primary'
                    forModal={true}
                    type='submit'
                    disabled={isSubmitting}
                    loading={isSubmitting}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
