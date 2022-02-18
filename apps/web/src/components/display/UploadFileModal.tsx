import { Modal } from '../Modal';
import { useRouter } from 'next/router';

export const UploadFileModal: React.FC = () => {
  const router = useRouter();

  const isOpen = !!router.query.bulk_upload;

  const handleClose = () => {
    delete router.query.bulk_upload;
    router.push(router, undefined, { shallow: true });
  };

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <Modal.Title as='h1' className='text-lg font-medium leading-6 text-bcBlueLink border-b p-4'>
        Upload BULK
      </Modal.Title>
      <div className='w-full max-w-xs'>
        <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <Modal.Description className='mb-7 flex items-center gap-3'>
            <span className='inline-block h-5 rounded-lg w-48 p-1 animate-pulse bg-gray-200' />
          </Modal.Description>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Username
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='username'
              type='text'
              placeholder='Username'
            />
          </div>
          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <input
              className='shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='******************'
            />
            <p className='text-red-500 text-xs italic'>Please choose a password.</p>
          </div>
          <div className='flex items-center justify-between'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
            >
              Add
            </button>
            <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              type='button'
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </form>
        <p className='text-center text-gray-500 text-xs'>
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </Modal>
  );
};
