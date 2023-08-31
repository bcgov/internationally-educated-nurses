import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../Modal';
import { UserGuideList } from './UserGuideList';
import { useAuthContext } from '../AuthContexts';

export const HeaderHelper = () => {
  const { authUser } = useAuthContext();

  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  if (!authUser) return null;

  return (
    <>
      <FontAwesomeIcon
        icon={faQuestionCircle}
        className='ml-4 text-white h-5 w-5'
        onClick={() => setOpen(true)}
      />
      <Modal handleClose={close} open={open}>
        <Modal.Title
          as='h1'
          className='text-lg font-medium leading-6 text-bcBluePrimary border-b p-4'
        >
          <div className='flex flex-row justify-between'>
            <div>User Guides</div>
            <FontAwesomeIcon icon={faTimes} className='ml-4 h-5 w-5' onClick={close} />
          </div>
        </Modal.Title>
        <div className='px-4 py-8'>
          <UserGuideList showVersions={false} />
          {/* to prevent error, 'There are no focusable elements inside the <FocusTrap />' */}
          <button className='h-0 w-0 overflow-hidden' />
        </div>
      </Modal>
    </>
  );
};
