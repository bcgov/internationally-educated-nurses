import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Dropzone } from '../Dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

import { Modal } from '../Modal';
import { Button } from '../Button';
import { uploadForm, onDropType } from '@services';
import { FormDTO } from '@ien/common';

export const UploadFileModal: React.FC = () => {
  const router = useRouter();
  const isOpen = !!router.query.bulk_upload;

  const handleClose = () => {
    delete router.query.bulk_upload;
    router.push(router.route, undefined, { shallow: true });
  };

  // @task add confirmation, warning, errors modal
  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <UploadPage closeModal={handleClose} />
    </Modal>
  );
};

/* Upload Page Component */
interface UploadPageProps {
  closeModal: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ closeModal }) => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  // parses csv file using papaparse, header uses column headers as keys in JSON data
  const handleFileUpload = async () => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: function (results) {
        const form = new FormDTO();
        form.file_name = file.name;
        // @task add check for empty strings
        form.form_data = JSON.stringify(results.data);

        uploadForm(form);
      },
    });

    // @task - will remove this portion once warning, error modals are implemented
    delete router.query.bulk_upload;
    router.push(router.route, undefined, { shallow: true });
  };

  // handles user dragging and dropping file in dropzone area
  const handleOnDrop: onDropType = async (acceptedFiles: File[]) => {
    // @task - implement error handling here
    if (acceptedFiles[0] === null) {
      return;
    }

    const fs = acceptedFiles[0];
    if (fs.name.toLowerCase().endsWith('.csv')) {
      // @task - implement error handling here
      if (fs.size == 0 || fs.name === '') {
        return;
      }

      setFile(acceptedFiles[0]);
    }
  };

  // removes file from upload modal
  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <div>
      <Modal.Title
        as='h1'
        className='text-lg font-medium leading-6 text-bcBluePrimary border-b p-4'
      >
        Upload
      </Modal.Title>
      <div className='p-5 flex gap-5 flex-col text-sm'>
        <Modal.Description>
          <span className='block'>(Must be a csv file)</span>
        </Modal.Description>
        <Dropzone onDrop={handleOnDrop} accept='.csv' />
        {file ? (
          <div className='flex justify-between items-center bg-gray-200 p-3'>
            <p>
              {file.name} | size: {file.size}
            </p>
            <button className='flex justify-between items-center' onClick={handleRemoveFile}>
              <FontAwesomeIcon icon={faTimesCircle} className='text-bcBluePrimary h-4' />
            </button>
          </div>
        ) : null}
      </div>
      <div className='w-full flex justify-between pt-2 p-3 border'>
        <Button onClick={closeModal} variant='outline' type='button'>
          Cancel
        </Button>
        <Button onClick={handleFileUpload} variant='primary' type='button' disabled={!file}>
          Upload
        </Button>
      </div>
    </div>
  );
};
