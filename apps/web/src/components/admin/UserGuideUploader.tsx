import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@components';
import { Modal } from '../Modal';
import { Dropzone } from '../Dropzone';
import { uploadUserGuide } from '../../services/admin';
import { useSWRConfig } from 'swr';

interface UserGuideUploaderProps {
  onClose: () => void;
  open: boolean;
}

export const UserGuideUploader = ({ onClose, open }: UserGuideUploaderProps) => {
  const { mutate } = useSWRConfig();
  const [file, setFile] = useState<File | null>();

  const handleOnDrop = (files: File[]) => {
    if (files[0]?.name.toLowerCase().endsWith('.pdf')) {
      setFile(files[0]);
    } else {
      toast.warning('Select a pdf file.');
    }
  };

  const close = () => {
    setFile(null);
    onClose();
  };

  const uploadFile = async () => {
    if (file) {
      const data = new FormData();
      data.append('name', file.name);
      data.append('file', file);

      await uploadUserGuide(data);
      mutate('/admin/user-guides').catch(e => toast.error(e.message));

      close();
    }
  };

  return (
    <Modal handleClose={() => void 0} open={open}>
      <Modal.Title
        as='h1'
        className='text-lg font-medium leading-6 text-bcBluePrimary border-b p-4'
      >
        Upload
      </Modal.Title>
      <div className='p-5 flex gap-5 flex-col text-sm'>
        <Modal.Description>
          <span className='block'>(Must be a pdf file)</span>
        </Modal.Description>
        <Dropzone onDrop={handleOnDrop} accept='.pdf' />
        {file ? (
          <div className='flex justify-between items-center bg-gray-200 p-3'>
            <p>
              {file.name} | size: {file.size}
            </p>
            <button className='flex justify-between items-center' onClick={() => setFile(null)}>
              <FontAwesomeIcon icon={faTimesCircle} className='text-bcBluePrimary h-4' />
            </button>
          </div>
        ) : null}
      </div>
      <div className='w-full flex justify-between pt-2 p-3 border'>
        <Button onClick={close} variant='outline' type='button'>
          Cancel
        </Button>
        <Button onClick={uploadFile} variant='primary' type='button' disabled={!file}>
          Upload
        </Button>
      </div>
    </Modal>
  );
};
