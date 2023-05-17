import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { UserGuide } from '@ien/common';
import { Modal } from '../Modal';
import { UserGuideList } from './UserGuideList';
import { getUserGuides } from '../../services/admin';
import { useAuthContext } from '../AuthContexts';
import { toast } from 'react-toastify';

export const HeaderHelper = () => {
  const { authUser } = useAuthContext();

  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<UserGuide[]>();

  useEffect(() => {
    if (open) {
      getUserGuides()
        .then(setFiles)
        .catch(e => toast.error(e.message));
    }
  }, [open]);

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
      <Modal handleClose={close} open={open && !!files}>
        <Modal.Title
          as='h1'
          className='text-lg font-medium leading-6 text-bcBluePrimary border-b p-4'
        >
          User Guides
        </Modal.Title>
        <div className='px-4 py-8'>{files && <UserGuideList files={files} />}</div>
      </Modal>
    </>
  );
};
