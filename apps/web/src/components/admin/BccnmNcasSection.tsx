import { buttonBase, buttonColor } from '@components';
import { useState } from 'react';
import { BccnmNcasDataUploader } from './BccnmNcasDataUploader';
import { BccnmNcasPreview } from './BccnmNcasPreview';
import { BccnmNcasValidation } from '@ien/common';

export const BccnmNcasSection = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [data, setData] = useState<BccnmNcasValidation[]>();

  const applyChanges = () => {
    setData(undefined);
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
            <button className={getButtonStyle()} onClick={handleClick}>
              {data?.length ? 'Apply' : 'Upload'}
            </button>
          </span>
        </div>
        {data && <BccnmNcasPreview data={data} />}
        <BccnmNcasDataUploader
          open={uploaderOpen}
          handleClose={() => setUploaderOpen(false)}
          handleValidation={setData}
        />
      </div>
    </>
  );
};
