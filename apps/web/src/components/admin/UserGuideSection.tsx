import { useState } from 'react';

import { buttonBase, buttonColor } from '@components';
import { UserGuideList } from './UserGuideList';
import { UserGuideUploader } from './UserGuideUploader';

export const UserGuideSection = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);

  return (
    <>
      <div className='bg-white p-4 mt-4'>
        <div className='flex flex-row justify-between'>
          <h2 className='font-bold text-lg text-bcBluePrimary my-4'>User Guides</h2>
          <button
            className={`px-4 ${buttonColor.outline} ${buttonBase} border-bcGray text-bcGray`}
            onClick={() => setUploaderOpen(true)}
          >
            Upload
          </button>
        </div>
        <UserGuideList />
      </div>
      <UserGuideUploader handleClose={() => setUploaderOpen(false)} open={uploaderOpen} />
    </>
  );
};
