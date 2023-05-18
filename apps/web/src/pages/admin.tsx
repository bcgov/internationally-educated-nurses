import { useState } from 'react';
import { Access } from '@ien/common';
import { buttonBase, buttonColor } from '@components';
import { UserGuideList } from '../components/admin/UserGuideList';
import withAuth from '../components/Keycloak';
import { UserGuideUploader } from '../components/admin/UserGuideUploader';

const AdminPage = () => {
  const [uploaderOpen, setUploaderOpen] = useState(false);

  return (
    <div className='container w-full mx-6 xl:w-xl mb-4'>
      <h1 className='font-bold text-3xl pt-6 pb-1'>Admin / Maintenance</h1>
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
      <UserGuideUploader onClose={() => setUploaderOpen(false)} open={uploaderOpen} />
    </div>
  );
};

export default withAuth(AdminPage, [Access.ADMIN]);
