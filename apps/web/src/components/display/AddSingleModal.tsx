import { useEffect, useState } from 'react';
import { Modal } from '../Modal';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';

export const AddSingleModal: React.FC = () => {
  const router = useRouter();

  const isOpen = !!router.query.add_row;

  const handleClose = () => {
    delete router.query.add_row;
    router.push(router.route, undefined, { shallow: true });
  };

  return (
    <Modal open={isOpen} handleClose={handleClose}>
      <Modal.Title as='h1' className='text-lg font-medium leading-6 text-bcBlueLink border-b p-4'>
        Add IEN
      </Modal.Title>
      <div className='w-full'>
        <form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
          <Modal.Description className='mb-7 flex items-center gap-3'>
            <span className='w-full inline-block h-5 rounded-lg p-1 animate-pulse bg-gray-200' />
          </Modal.Description>
          <div className='mb-4'>
            <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Test Label 1
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='t1'
              type='text'
              placeholder='Test Input 2'
            />
          </div>
          <div className='mb-4'>
            <label className='text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Test Label 2
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='t2'
              type='text'
              placeholder='Test Input 2'
            />
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
        <p className='text-center text-gray-500 text-xs'>&copy; Something</p>
      </div>
    </Modal>
  );
};
