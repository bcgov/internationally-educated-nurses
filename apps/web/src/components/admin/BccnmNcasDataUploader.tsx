import { useState } from 'react';
import { FileUploader } from '../FileUploader';
import { ModalProps } from '../Modal';
import { Spinner } from '../Spinner';
import { validateBccnmNcasUpdates } from '../../services/admin';
import { BccnmNcasValidation } from '@ien/common';

interface BccnmNcasDataUploaderProps extends ModalProps {
  handleValidation: (data: BccnmNcasValidation[]) => void;
}

export const BccnmNcasDataUploader = ({
  handleClose,
  open,
  handleValidation,
}: BccnmNcasDataUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const uploadFile = async (file: File) => {
    if (file) {
      setLoading(true);
      const data = new FormData();
      data.append('name', file.name);
      data.append('file', file);

      handleValidation(await validateBccnmNcasUpdates(data));
      handleClose();
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner className='h-10 w-10' />;
  }

  return (
    <FileUploader
      open={open}
      extensions={['xls', 'xlsx', 'csv']}
      handleClose={handleClose}
      upload={uploadFile}
    />
  );
};
