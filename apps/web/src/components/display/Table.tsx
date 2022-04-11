import { useEffect, useState } from 'react';
import Link from 'next/link';

import { AddSingleModal } from './AddSingleModal';
import { UploadFileModal } from './UploadFileModal';
import { buttonBase, buttonColor } from '../';
import { getApplicants } from '@services';
import { Spinner } from '../Spinner';

export const Table: React.FC = () => {
  const [applicants, setApplicants] = useState<any>([]);
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return <Spinner className='h-10' />;
  }

  return (
    <>
      <h1 className='font-bold text-3xl py-5'>Manage Applicants</h1>
      <div className='container mx-auto bg-white'>
        <div className='flex items-center my-3 px-4'>
          <p className='text-gray-400'>Showing {applicants.length} results</p>
        </div>

        <div className='flex justify-content-center flex-col  px-4'>
          <div className='overflow-x-auto'>
            <table className='text-left'>
              <thead className='whitespace-nowrap bg-gray-100'>
                <tr className='border-b-2 border-yellow-300 text-sm'>
                  <th className='pl-6 py-3'>ID</th>
                  <th className='px-6 py-3'>Name</th>
                  <th className='px-6 py-3 w-1/4'>Current Milestones</th>
                  <th className='px-6 py-3'>Last Updated</th>
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
                      <th className='font-normal px-6 py-4'>AB1234</th>
                      <th className='font-normal px-6 py-4'>{app.name}</th>

                      <th className='font-normal px-6 py-2'>{app.status?.status}</th>
                      <th className='font-normal px-6 py-4'>January 5, 2022</th>
                      <td className='font-normal px-6 py-4 text-right'>
                        <Link
                          href={{
                            pathname: `details/${app.id}`,
                            query: {
                              applicantId: app.id,
                            },
                          }}
                          as={`details/${app.id}`}
                        >
                          <a className={`px-5 ${buttonColor.outline} ${buttonBase}`}>Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>pagination here</div>
      </div>
      <AddSingleModal />
      <UploadFileModal />
    </>
  );
};
