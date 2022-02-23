import { useRouter } from 'next/router';
import { useState } from 'react';
import { Dropzone, onDropType } from '../Dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

import { Modal } from '../Modal';
import { Button } from '../Button';
import { route } from 'next/dist/server/router';

export const UploadFileModal: React.FC = () => {
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const isOpen = !!router.query.bulk_upload;

  const handleClose = () => {
    console.log(router);
    delete router.query.bulk_upload;
    router.push(router.route, undefined, { shallow: true });
  };

  // @todo add confirmation, warning, errors modal
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
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const router = useRouter();

  // parses csv file using papaparse, header uses column headers as keys in JSON data
  const handleFileUpload = async () => {
    console.log(file);
    Papa.parse(file, {
      header: true,
      transformHeader: h => {
        return h.replace(/\s/g, '');
      },
      complete: function (results) {
        console.log('FILE: ', results.data);
      },
    });
  };

  // handles user dragging and dropping file in dropzone area
  const handleOnDrop: onDropType = async acceptedFiles => {
    const file = acceptedFiles[0];
    if ((file as File).name.toLowerCase().endsWith('.csv')) {
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
        <Dropzone onDrop={handleOnDrop} />
        {file ? (
          <div className='flex justify-between items-center bg-gray-200 p-3'>
            <p>
              {file.name} {file.size}
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
        <Button
          onClick={handleFileUpload}
          variant='primary'
          type='button'
          disabled={!file || uploading}
        >
          Upload
        </Button>
      </div>
    </div>
  );
};
