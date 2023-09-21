import { useState } from 'react';
import { BccnmNcasValidation, pluralize } from '@ien/common';
import { buttonBase, buttonColor, Spinner } from '@components';
import { BccnmNcasDataUploader } from './BccnmNcasDataUploader';
import { BccnmNcasPreview } from './BccnmNcasPreview';
import { applyBccnmNcasUpdates } from '../../services/admin';
import { toast } from 'react-toastify';

export const BccnmNcasSection = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [data, setData] = useState<BccnmNcasValidation[]>();
  const [loading, setLoading] = useState(false);

  const applyChanges = async () => {
    if (data?.length) {
      const payload = data.filter(e => e.valid);
      setLoading(true);
      await applyBccnmNcasUpdates(payload);
      toast.success(`${pluralize(payload.length, 'applicant')} updated`);
      setLoading(false);
      setData(undefined);
    }
  };

  const getButtonStyle = () => {
    if (data?.length) {
      return `px-4 ${buttonColor.primary} ${buttonBase}`;
    }
    return `px-4 ${buttonColor.outline} ${buttonBase} border-bcGray text-bcGray`;
  };

  const cancel = () => {
    setUploaderOpen(false);
    setData(undefined);
  };

  const handleClick = () => {
    if (data?.length) {
      applyChanges();
    } else {
      setUploaderOpen(true);
    }
  };

  return (
    <>
      <div className='bg-white p-4 mt-4'>
        <div className='flex flex-row justify-between'>
          <h2 className='font-bold text-lg text-bcBluePrimary my-4'>Upload BCCNM/NCAS Data</h2>
          <span>
            {data && (
              <button
                className={`mr-2 px-4 ${buttonColor.outline} ${buttonBase} border-bcGray text-bcGray`}
                onClick={cancel}
              >
                Cancel
              </button>
            )}
            <button
              className={getButtonStyle()}
              onClick={handleClick}
              disabled={data && !data.filter(e => e.valid).length}
            >
              {data?.length ? 'Apply' : 'Upload'}
            </button>
          </span>
        </div>
        {data && <BccnmNcasPreview data={data} />}
        {loading && <Spinner size='2x' />}
        <BccnmNcasDataUploader
          open={uploaderOpen}
          handleClose={() => setUploaderOpen(false)}
          handleValidation={setData}
        />
      </div>
    </>
  );
};
