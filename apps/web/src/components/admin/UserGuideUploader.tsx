import { toast } from 'react-toastify';
import { uploadUserGuide } from '../../services/admin';
import { useSWRConfig } from 'swr';
import { FileUploader } from '../FileUploader';
import { ModalProps } from '../Modal';

export const UserGuideUploader = ({ handleClose, open }: ModalProps) => {
  const { mutate } = useSWRConfig();

  const uploadFile = async (file: File) => {
    if (file) {
      const data = new FormData();
      data.append('name', file.name);
      data.append('file', file);

      await uploadUserGuide(data);
      mutate('/admin/user-guides').catch(e => toast.error(e.message));

      handleClose();
    }
  };

  return (
    <FileUploader open={open} extensions={['pdf']} handleClose={handleClose} upload={uploadFile} />
  );
};
