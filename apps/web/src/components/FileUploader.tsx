import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { Modal, ModalProps } from './Modal';
import { Dropzone } from './Dropzone';
import { Button } from './Button';
import { getSizeWithUnit } from '../utils/get-size-with-unit';

interface FileUploaderProps extends ModalProps {
  extensions: string[];
  upload: (file: File) => void;
}

export const FileUploader = ({ extensions, handleClose, open, upload }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>();

  if (!open && file) {
    setFile(null);
  }
  const handleOnDrop = (files: File[]) => {
    const ext = files[0]?.name.split('.').pop();
    if (ext && extensions.includes(ext)) {
      setFile(files[0]);
    } else {
      toast.warning(`Select a file of type: ${extensions.join(', ')}`);
    }
  };

  const close = () => {
    setFile(null);
    handleClose();
  };

  const uploadFile = () => {
    if (file) upload(file);
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
          <span className='block'>({`Must be a file of type: ${extensions.join(', ')}`})</span>
        </Modal.Description>
        <Dropzone onDrop={handleOnDrop} accept={extensions.map(ext => `.${ext}`)} />
        {file ? (
          <div className='flex justify-between items-center bg-gray-200 p-3'>
            <p>
              {file.name} | size: {getSizeWithUnit(file.size)}
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
