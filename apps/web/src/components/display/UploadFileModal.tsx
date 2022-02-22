import { useRouter } from 'next/router';
import { useState } from 'react';
import { Dropzone, onDropType } from '../Dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';

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

  const handleFileUpload = async () => {
    let reader = new FileReader();

    reader.readAsArrayBuffer(file);

    reader.onload = e => {
      let data = e.target?.result;
      console.log('DATA: ', data);
      let workbook = XLSX.read(data, {
        type: 'array',
        sheets: [
          // maybe something to do with colour legends??
          // 'Referrals from 26.06.2020',
          'Follow Up Candidates',
          'Trends - Nurses',
          'Trends - NPs',
          'Lists',
        ],
        cellStyles: true,
      });
      console.log('workbook: ', workbook);

      for (let i = 0; i < workbook.SheetNames.length; i++) {
        const worksheetNames = workbook.SheetNames[i];
        console.log('worksheetNames: ', worksheetNames);
        let worksheet = workbook.Sheets[worksheetNames];
        console.log('worksheet: ', worksheet);

        // convert to json format
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('JSON: ', jsonData);
      }
    };
    reader.onerror = ex => {
      console.log('ERROR: ', ex);
    };
    setUploading(true);

    // will remove once progress is implemented
    delete router.query.bulk_upload;
    router.push(router.route, undefined, { shallow: true });
  };

  // handles user dragging and dropping file in dropzone area
  const handleOnDrop: onDropType = async acceptedFiles => {
    const file = acceptedFiles[0];
    if ((file as File).name.toLowerCase().endsWith('.xlsx')) {
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
          <span className='block'>(Must be an excel file)</span>
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
