import { useRouter } from 'next/router';
import Link from 'next/link';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { AddSingleModal } from './AddSingleModal';
import { UploadFileModal } from './UploadFileModal';
import { buttonBase, buttonColor, ButtonDropdown, TableCheckbox } from '../';
import { useEffect, useState } from 'react';
import { getApplicants } from '@services';

export const Table: React.FC = () => {
  const [applicants, setApplicants] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getApplicantsData = async () => {
      setLoading(true);
      const {
        data: { data },
      } = await getApplicants();

      setLoading(false);
      setApplicants(data);
    };
    getApplicantsData();
  }, []);

  if (loading) return <h1>Loading .....</h1>;

  return (
    <>
      <div className='container xl:p-auto'>
        <h1 className='font-bold text-3xl py-5'>Manage Applicants</h1>
        <div className='flex justify-end items-end'>
          <ButtonDropdown title='Add/Upload' icon={faChevronDown} variant='secondary'>
            <Link
              href={{
                pathname: '/form',
                query: { ...router.query, add_row: 'test_single_row' },
              }}
              shallow={true}
            >
              <a className='flex items-center p-1 m-1 transition duration-150 ease-in-out rounded hover:bg-gray-100'>
                <p className='text-sm font-bold text-gray-900'>Add Record</p>
              </a>
            </Link>
            <span className='border-b-2 border-opacity-50 w-full' />
            <Link
              href={{
                pathname: '/form',
                query: { ...router.query, bulk_upload: 'test_bulk_upload' },
              }}
              shallow={true}
            >
              <a className='flex items-center p-1 m-1 transition duration-150 ease-in-out rounded hover:bg-gray-100'>
                <p className='text-sm font-bold text-gray-900'>Upload</p>
              </a>
            </Link>
          </ButtonDropdown>
          <ButtonDropdown
            title='Download Records'
            icon={faChevronDown}
            variant='primary'
          ></ButtonDropdown>
        </div>
        <div className='flex bg-red-300'>pagination here</div>
        <div className='flex justify-content-center flex-col overflow-x-auto'>
          <table className='text-left'>
            <thead className='whitespace-nowrap bg-gray-100'>
              <tr className='border-b-2 border-yellow-300 text-sm'>
                <th className='pl-6 py-3'>
                  <TableCheckbox name={`cb.selector.MA`} value='ALL' />
                </th>
                <th className='pl-6 py-3'>ID</th>
                <th className='px-6 py-3'>First Name</th>
                <th className='px-6 py-3'>Last Name</th>
                <th className='px-6 py-3 w-1/4'>Current Milestones</th>
                <th className='w-auto'></th>
              </tr>
            </thead>
            <tbody>
              {applicants &&
                applicants.map((app: any) => (
                  <tr
                    key={app.id}
                    className='text-left whitespace-nowrap even:bg-gray-100 text-sm '
                  >
                    <th className='pl-6'>
                      <TableCheckbox name={`cb.selector.MA`} value={app.id} />
                    </th>

                    <th className='font-normal px-6 py-4'>{app.id}</th>
                    <th className='font-normal px-6 py-4'>{app.first_name}</th>
                    <th className='font-normal px-6 py-4'>{app.last_name}</th>
                    <th className='font-normal px-6 py-2'>{app.status.status}</th>
                    <td className='font-normal px-6 py-4 text-right'>
                      <a className={`w-full ${buttonColor.outline} ${buttonBase}`}>Details</a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className='flex bg-red-300'>pagination here</div>
      </div>
      <AddSingleModal applicants={applicants} setApplicants={setApplicants} />
      <UploadFileModal />
    </>
  );
};
